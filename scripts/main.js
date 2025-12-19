// Año actual y última modificación
const year = document.getElementById("currentyear");
const lastModified = document.getElementById("lastmodified");
if (year) year.textContent = new Date().getFullYear();
if (lastModified) lastModified.textContent = document.lastModified;

// Menú hamburguesa
const hamburger = document.getElementById("hamburger");
const navList = document.querySelector(".nav__list");
if (hamburger && navList) {
  hamburger.addEventListener("click", () => {
    navList.classList.toggle("show");
  });
}

// Animación para sección About
const timelineItems = document.querySelectorAll(".timeline-item");
function showOnScroll() {
  timelineItems.forEach(item => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      item.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", showOnScroll);
showOnScroll();

// Carrusel de servicios con indicadores dinámicos y auto-slide
const carousel = document.querySelector(".service-carousel");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
const indicatorsContainer = document.getElementById("carousel-indicators");
const cards = document.querySelectorAll(".service-card");

if (carousel && cards.length > 0) {
  let currentIndex = 0;
  let autoSlide;
  let visibleCards;
  let totalSlides;

  // Crear o recalcular indicadores dinámicamente
  function generateIndicators() {
    visibleCards = window.innerWidth >= 768 ? 3 : 1;
    totalSlides = window.innerWidth >= 768
      ? Math.ceil(cards.length / visibleCards)
      : cards.length;

    indicatorsContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      dot.dataset.index = i;
      if (i === currentIndex) dot.classList.add("active");
      indicatorsContainer.appendChild(dot);
    }
    updateIndicators(currentIndex);
  }

  function updateIndicators(index) {
    document.querySelectorAll(".carousel-indicators button").forEach(dot => {
      dot.classList.remove("active");
    });
    const activeDot = document.querySelector(`.carousel-indicators button[data-index="${index}"]`);
    if (activeDot) activeDot.classList.add("active");
  }

  function slideTo(index) {
    const cardWidth = cards[0].getBoundingClientRect().width + 16;
    currentIndex = index;
    carousel.scrollTo({
      left: cardWidth * index,
      behavior: "smooth"
    });
    updateIndicators(currentIndex);
  }

  function slideNext() {
    currentIndex = (currentIndex + 1) % totalSlides;
    slideTo(currentIndex);
  }

  function slidePrev() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    slideTo(currentIndex);
  }

  nextBtn?.addEventListener("click", slideNext);
  prevBtn?.addEventListener("click", slidePrev);

  // 📍 Click en indicadores
  indicatorsContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      slideTo(Number(e.target.dataset.index));
    }
  });

  // Auto-slide cada 4 segundos
  function startAutoSlide() {
    stopAutoSlide();
    autoSlide = setInterval(slideNext, 4000);
  }
  function stopAutoSlide() {
    clearInterval(autoSlide);
  }

  carousel.addEventListener("mouseenter", stopAutoSlide);
  carousel.addEventListener("mouseleave", startAutoSlide);

  // Generar indicadores al cargar y recalcular al cambiar tamaño
  generateIndicators();
  startAutoSlide();

  window.addEventListener("resize", () => {
    generateIndicators();
    slideTo(0);
  });
}

initParallaxHero();

// Animaciones de aparición con IntersectionObserver para el formulario y timeline

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".timeline-item, .fade-in-up");

  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible"); // para que reaparezcan
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  items.forEach((el) => observer.observe(el));
});
