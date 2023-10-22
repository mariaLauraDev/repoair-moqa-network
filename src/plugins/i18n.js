import { createI18n } from 'vue-i18n'
import en from '../locales/en'
import ptBR from '../locales/pt-BR'

const i18n = createI18n({
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    en: en,
    'pt-BR': ptBR
  },
})

export default i18n