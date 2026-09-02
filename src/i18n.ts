import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ru from './locales/ru.json'

const messages = {
  en,
  ru,
}
const supportedLocales = Object.keys(messages)

function getBrowserLocale(): string {
  const navigatorLocale = navigator.languages?.[0] ?? navigator.language ?? 'en'
  const lang = navigatorLocale.trim().split(/-|_/)[0]!.toLowerCase()
  return supportedLocales.includes(lang) ? lang : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLocale(),
  fallbackLocale: 'en',
  messages,
})

export default i18n
