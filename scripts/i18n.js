let currentLang = localStorage.getItem("rtn_lang") || "es";
let translations = {};

// Carga dinámicamente los JSON
async function loadTranslations() {
  const page = document.body.dataset.page;

  // módulos globales + contact (para formularios)
  const modules = ["nav", "footer", "contact"];

  // módulo específico de la página
  if (page) modules.push(page);

  translations = { es: {}, en: {} };

  for (const module of modules) {
    try {
      const res = await fetch(`scripts/locales/${module}.json`);
      const data = await res.json();

      translations.es = { ...translations.es, ...data.es };
      translations.en = { ...translations.en, ...data.en };

    } catch (err) {
      console.error("Error loading locale:", module, err);
    }
  }

  applyTranslations();
}

// Atajo para obtener texto
function t(key) {
  return translations[currentLang]?.[key] || key;
}

// Aplica traducciones
function applyTranslations() {
  // elementos con texto normal
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const text = t(key);

    if (!text) return;

    // casitos especiales
    if (el.tagName === "TITLE") {
      document.title = text;
      return;
    }
    if (el.tagName === "META" && el.name === "description") {
      el.setAttribute("content", text);
      return;
    }

    el.textContent = text;
  });

  // placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = t(key);
  });

  // alt dinámico
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const key = el.getAttribute("data-i18n-alt");
    el.alt = t(key);
  });
}

// Cambia idioma
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("rtn_lang", lang);
  loadTranslations();
  updateLangSwitchUI();
}

// Actualiza UI del switch
function updateLangSwitchUI() {
  document
    .querySelectorAll("[data-lang-switch]")
    .forEach((btn) =>
      btn.classList.toggle(
        "lang-switch__btn--active",
        btn.dataset.langSwitch === currentLang
      )
    );
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.langSwitch));
  });

  loadTranslations();
  updateLangSwitchUI();
});
