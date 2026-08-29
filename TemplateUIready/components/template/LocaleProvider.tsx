'use client'

import { NextIntlClientProvider } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'

type LocaleProviderProps = {
  messages: AbstractIntlMessages
  children: React.ReactNode
  locale: string
}

const LocaleProvider = ({ messages, children, locale }: LocaleProviderProps) => {
  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  )
}

export default LocaleProvider
