const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const oauth2Config = require('./oauth2.config');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const oauth2Client = new OAuth2(
    oauth2Config.clientId,
    oauth2Config.clientSecret,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: oauth2Config.refreshToken
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: oauth2Config.user,
        clientId: oauth2Config.clientId,
        clientSecret: oauth2Config.clientSecret,
        refreshToken: oauth2Config.refreshToken,
        accessToken: oauth2Client.getAccessToken()
    }
});

app.post('/send-email', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate inputs
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }

        const mailOptions = {
            from: oauth2Config.user,
            to: oauth2Config.user,
            replyTo: email,
            subject: `Portfolio Contact from ${name}`,
            text: `
Name: ${name}
Email: ${email}
Message: ${message}
            `,
            html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong> ${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email. Please try again later.' 
        });
    }
});

// Static file serving
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('.'));
}

// Handle SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
