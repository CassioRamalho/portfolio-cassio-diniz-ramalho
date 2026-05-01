const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");

if (navToggle && siteNav) {
  const closeMenu = () => {
    navToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

if (siteHeader) {
  const syncHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const carousels = document.querySelectorAll("[data-carousel]");

carousels.forEach((carousel) => {
  const slides = [...carousel.querySelectorAll("[data-slide]")];
  const dots = [...carousel.querySelectorAll("[data-jump]")];
  const prevButton = carousel.querySelector('[data-direction="-1"]');
  const nextButton = carousel.querySelector('[data-direction="1"]');
  let currentIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  let autoRotateId = null;

  if (currentIndex < 0) {
    currentIndex = 0;
    slides[0]?.classList.add("is-active");
    dots[0]?.classList.add("is-active");
  }

  const setSlide = (nextIndex) => {
    slides[currentIndex]?.classList.remove("is-active");
    dots[currentIndex]?.classList.remove("is-active");

    currentIndex = (nextIndex + slides.length) % slides.length;

    slides[currentIndex]?.classList.add("is-active");
    dots[currentIndex]?.classList.add("is-active");
  };

  const startAutoRotate = () => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    stopAutoRotate();
    autoRotateId = window.setInterval(() => {
      setSlide(currentIndex + 1);
    }, 5500);
  };

  const stopAutoRotate = () => {
    if (autoRotateId) {
      window.clearInterval(autoRotateId);
      autoRotateId = null;
    }
  };

  prevButton?.addEventListener("click", () => {
    setSlide(currentIndex - 1);
    startAutoRotate();
  });

  nextButton?.addEventListener("click", () => {
    setSlide(currentIndex + 1);
    startAutoRotate();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setSlide(index);
      startAutoRotate();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoRotate);
  carousel.addEventListener("mouseleave", startAutoRotate);
  carousel.addEventListener("focusin", stopAutoRotate);
  carousel.addEventListener("focusout", startAutoRotate);

  startAutoRotate();
});
