import type { I18n } from 'vue-i18n'
import { createI18n as createVueI18n } from 'vue-i18n'
import zhCN from './locales/zhCN'
import enUS from './locales/enUS'

export const createI18n = (): I18n<any> => {
  const i18n = createVueI18n({
    locale: 'zhCN', // set locale
    fallbackLocale: 'enUS', // set fallback locale
    messages: {
      zhCN,
      enUS
    }
  })
  return i18n
}
