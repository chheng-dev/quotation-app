'use client'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import enFlag from '../app/assets/images/england-flag.svg'
import khFlag from '../app/assets/images/kh-flag.svg'
import { Button } from './ui/button'

type LanguageSwitcherProps = {
  isDashboard?: boolean
}

export function LanguageSwitcher({
  isDashboard = true,
}: LanguageSwitcherProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleToggleLanguage = () => {
    const newLocale = locale === 'en' ? 'km' : 'en'

    let cleanPath = pathname
    const locales = ['en', 'km']

    for (const loc of locales) {
      if (cleanPath.startsWith(`/${loc}/`)) {
        cleanPath = cleanPath.substring(`/${loc}`.length)
        break
      } else if (cleanPath === `/${loc}`) {
        cleanPath = '/'
        break
      }
    }

    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath
    }

    const queryString = searchParams.toString()
    const newPath = `/${newLocale}${cleanPath}${queryString ? `?${queryString}` : ''}`
    router.push(newPath)
  }

  const languages = {
    en: {
      flag: enFlag,
      name: 'English',
      nativeName: 'English',
      code: 'EN',
    },
    km: {
      flag: khFlag,
      name: 'Khmer',
      nativeName: 'ខ្មែរ',
      code: 'KM',
    },
  }

  const currentLanguage =
    languages[locale as keyof typeof languages] || languages.en

  return (
    <Button
      onClick={handleToggleLanguage}
      className={`group relative flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
        isDashboard
          ? 'h-10 px-3 bg-background border border-border/50 rounded-lg hover:bg-muted/50 hover:scale-105'
          : 'px-2 py-1 bg-transparent hover:bg-muted/30 rounded-lg'
      }`}
      title={`Switch to ${locale === 'en' ? 'Khmer' : 'English'}`}
    >
      <div className="flex items-center gap-2">
        <div className="relative w-5 h-5 transition-transform duration-200 group-hover:scale-110">
          <Image
            src={currentLanguage.flag}
            alt={`${currentLanguage.name} flag`}
            fill
            className="object-cover rounded-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 ml-1">
        <div className="w-0.5 h-4 bg-border rounded-full opacity-30"></div>
        <div className="text-xs text-muted-foreground font-medium">
          {locale === 'en' ? 'EN' : 'ខ្មែរ'}
        </div>
      </div>

      <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
    </Button>
  )
}
