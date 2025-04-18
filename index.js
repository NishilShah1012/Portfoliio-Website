// Custom cursor
document.addEventListener("mousemove", (e) => {
    const cursor = document.querySelector(".custom-cursor");
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

// Cursor effects on hover
document.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("mouseenter", () => {
        document.querySelector(".custom-cursor").style.transform =
            "translate(-50%, -50%) scale(2)";
    });
    item.addEventListener("mouseleave", () => {
        document.querySelector(".custom-cursor").style.transform =
            "translate(-50%, -50%) scale(1)";
    });
});

// Fade-in animations
const observerOptions = {
    threshold: 0.25,
    rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll(".fade-in").forEach((item) => {
    observer.observe(item);
});

// Sticky navigation
window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (window.scrollY > 100) {
        nav.style.padding = "1rem 5%";
        nav.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    } else {
        nav.style.padding = "2rem 5%";
        nav.style.backgroundColor = "transparent";
    }
});

// Scroll to top functionality
const scrollToTopBtn = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("visible");
    } else {
        scrollToTopBtn.classList.remove("visible");
    }
});

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});