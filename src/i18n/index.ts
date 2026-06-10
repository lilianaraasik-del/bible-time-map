import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import et from "./locales/et.json";
import en from "./locales/en.json";
import ru from "./locales/ru.json";

export const SUPPORTED_LANGS = ["et", "en", "ru"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      et: { translation: et },
      en: { translation: en },
      ru: { translation: ru },
    },
    fallbackLng: "et",
    supportedLngs: SUPPORTED_LANGS,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

// Sync <html lang> with active language
if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language || "et";
  i18n.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
  });
}

export default i18n;
