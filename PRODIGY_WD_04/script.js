const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");
const revealElements = document.querySelectorAll(".reveal");

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

function updateActiveLink() {
  let current = "home";

  sections.forEach(section => {
    const top = section.offsetTop - 170;
    const height = section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < top + height) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

function revealOnScroll() {
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const revealPoint = 115;

    if (elementTop < window.innerHeight - revealPoint) {
      element.classList.add("show");
    }
  });
}

window.addEventListener("scroll", () => {
  updateNavbar();
  updateActiveLink();
  revealOnScroll();
});

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  menuBtn.textContent = navLinks.classList.contains("show") ? "✕" : "☰";
});

navItems.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuBtn.textContent = "☰";
  });
});

updateNavbar();
updateActiveLink();
revealOnScroll();
