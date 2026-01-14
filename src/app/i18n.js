import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

/**
 * Configuración de traducciones (i18n)
 * - Cargar traducciones desde /public/locales
 * - Detectar idioma del usuario (localStorage o navegador)
 * - Permitir cambiar de idioma en tiempo real
 */
i18n
  .use(HttpBackend)       // permite cargar JSON desde archivos
  .use(LanguageDetector)  // detecta el idioma automáticamente
  .use(initReactI18next)  // conecta i18next con React
  .init({
    fallbackLng: "es",
    supportedLngs: ["es", "en"],
    ns: ["common"],
    defaultNS: "common",

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
