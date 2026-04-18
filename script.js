/*
  The Grand Machal - Shared Script
  Handles nav toggle, smooth scrolling, reveal animations, and form validation.
*/

document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // Mark active page in navbar
  const pageName = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === pageName) {
      link.classList.add("active");
    }
  });

  // Smooth scroll for same-page anchor links
  document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href) return;

      const [path, hash] = href.split("#");
      const currentPath = window.location.pathname.split("/").pop() || "index.html";
      const targetPath = path || currentPath;

      if (!hash || targetPath !== currentPath) return;

      const target = document.getElementById(hash);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Scroll reveal animation
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // Set minimum date for booking forms to today
  const today = new Date().toISOString().split("T")[0];
  document.querySelectorAll('.booking-form input[name="date"]').forEach((input) => {
    input.min = today;
  });

  // Pre-fill room type from query string when available
  const params = new URLSearchParams(window.location.search);
  const roomFromQuery = params.get("room");
  if (roomFromQuery) {
    document.querySelectorAll('.booking-form select[name="roomType"]').forEach((select) => {
      const optionExists = Array.from(select.options).some((opt) => opt.value === roomFromQuery);
      if (optionExists) select.value = roomFromQuery;
    });
  }

  // Booking form validation
  document.querySelectorAll(".booking-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = form.querySelector('input[name="name"]');
      const date = form.querySelector('input[name="date"]');
      const roomType = form.querySelector('select[name="roomType"]');
      const message = form.querySelector(".form-message");

      let errors = [];

      if (!name.value.trim()) {
        errors.push("Please enter your name.");
      }

      if (!date.value) {
        errors.push("Please select a check-in date.");
      } else if (date.value < today) {
        errors.push("Check-in date cannot be in the past.");
      }

      if (!roomType.value) {
        errors.push("Please select a room type.");
      }

      if (errors.length) {
        message.textContent = errors[0];
        message.className = "form-message error";
        return;
      }

      message.textContent = "Thank you! Your booking request has been submitted.";
      message.className = "form-message success";
      form.reset();
    });
  });

  // Contact form basic validation
  document.querySelectorAll(".contact-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = form.querySelector('input[name="name"]');
      const email = form.querySelector('input[name="email"]');
      const messageText = form.querySelector('textarea[name="message"]');
      const message = form.querySelector(".form-message");

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!name.value.trim() || !emailValid || !messageText.value.trim()) {
        message.textContent = "Please provide a valid name, email, and message.";
        message.className = "form-message error";
        return;
      }

      message.textContent = "Message sent successfully. Our team will contact you shortly.";
      message.className = "form-message success";
      form.reset();
    });
  });

  // Dynamic year in footer
  document.querySelectorAll(".year").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
});
