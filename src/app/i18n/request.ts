import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'km'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    locale = 'en'
  }

  if (!locales.includes(locale as Locale)) {
    locale = 'en'
  }

  let messages = {}
  try {
    if (locale === 'en') {
      messages = (await import('../../message/en.json')).default
    } else if (locale === 'km') {
      messages = (await import('../../message/km.json')).default
    }
  } catch (error) {
    console.error('Error loading messages for locale:', locale, error)
    messages = {}
  }

  return {
    locale,
    messages,
  }
})
