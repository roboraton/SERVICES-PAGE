// ----------------------------------------------
// Services Page — Dynamic Load + Animations
// ----------------------------------------------

async function loadAndRenderServices() {
  const lang = localStorage.getItem("rtn_lang") || "es";
  const container = document.getElementById("services-list");

  if (!container) return;

  try {
    // Carga del JSON de servicios
    const res = await fetch("scripts/locales/servicesData.json");
    const data = await res.json();

    const services = data[lang];

    // Render dinámico
    container.innerHTML = services
      .map(
        (srv) => `
        <article class="service-detail fade-in-up">
          
          <img 
            src="images/service-${srv.id}.jpg" 
            alt="${srv.title}" 
            loading="lazy"
          />

          <div class="service-detail__content">
            <h2>${srv.title}</h2>
            <p>${srv.description}</p>

            <ul>
              ${srv.bullets.map((b) => `<li>${b}</li>`).join("")}
            </ul>

            <a href="#contact" class="btn btn--secondary">
              ${lang === "es" ? "Pedir cotización" : "Get a quote"}
            </a>
          </div>

        </article>
      `
      )
      .join("");

    // Activar animaciones
    animateOnScroll();

  } catch (err) {
    console.error("Error loading services:", err);
  }
}

// ----------------------------------------------
// IntersectionObserver (aparece + desaparece)
// ----------------------------------------------
function animateOnScroll() {
  const items = document.querySelectorAll(".fade-in-up");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Cuando aparece en pantalla
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          // Cuando desaparece del viewport
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.2 } // sensibilidad
  );

  items.forEach((el) => observer.observe(el));
}

// ----------------------------------------------
// Inicialización automática
// ----------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadAndRenderServices();

  // Si cambias de idioma, vuelve a renderizar
  document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTimeout(loadAndRenderServices, 50);
    });
  });
});

// -----------------------------
// Parallax suave del hero
// -----------------------------
function initParallaxHero() {
  const bg = document.querySelector(".hero--parallax .hero__bg");
  if (!bg) return;

  window.addEventListener("scroll", () => {
    const y = window.scrollY * 0.22; // velocidad del parallax
    bg.style.transform = `translateY(${y}px)`;
  });
}

// Inicializar parallax al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  initParallaxHero();
});
