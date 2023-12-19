import i18n, {InitOptions} from "i18next"
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from "react-i18next"
import { LOCALE_BROWSER_MAPPINGS, LOCALE_RESOURCES } from "@config/i18n";

const languageDetector = new LanguageDetector();

languageDetector.addDetector({
  name: 'custom_detector',
  lookup() {
    const detectedLang = typeof window !== 'undefined'
      ? navigator.language
      : 'en';
    return LOCALE_BROWSER_MAPPINGS[detectedLang]
  },
})

const options:InitOptions = {
  resources: LOCALE_RESOURCES,
  fallbackLng: 'en',
}


i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init(options)

export default i18n