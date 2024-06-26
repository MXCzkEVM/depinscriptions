import type { InitOptions } from 'i18next'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { LOCALE_BROWSER_MAPPINGS, LOCALE_RESOURCES } from '@/config'

const languageDetector = new LanguageDetector()

languageDetector.addDetector({
  name: 'custom_detector',
  lookup() {
    const detectedLang = typeof window !== 'undefined'
      ? navigator.language
      : 'en'
    return LOCALE_BROWSER_MAPPINGS[detectedLang]
  },
})

const options: InitOptions = {
  resources: LOCALE_RESOURCES,
  fallbackLng: 'en',
}

i18n
  .use(languageDetector)
  .init(options)
export { i18n }
export default i18n
