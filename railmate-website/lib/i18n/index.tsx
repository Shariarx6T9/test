'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import en from './en.json'
import bn from './bn.json'

export type Locale = 'en' | 'bn'
type Dictionary = typeof en

interface I18nContextType {
  locale: Locale
  t: Dictionary
  setLocale: (locale: Locale) => void
}

const dictionaries = { en, bn } as const

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // The URL param is the canonical source of truth.
  // With localePrefix 'as-needed', the root path (/) has no [locale] segment,
  // so params.locale will be undefined — that means Bengali (the default).
  const params = useParams()
  const urlLocale = params?.locale as Locale | undefined

  // undefined → root path → Bengali default
  const validLocale: Locale =
    urlLocale === 'en' ? 'en' : 'bn'

  const [locale, setLocaleState] = useState<Locale>(validLocale)

  useEffect(() => {
    setLocaleState(validLocale)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = validLocale === 'bn' ? 'bn' : 'en'
    }
  }, [validLocale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale === 'bn' ? 'bn' : 'en'
    }
  }

  return (
    <I18nContext.Provider value={{ locale, t: dictionaries[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
