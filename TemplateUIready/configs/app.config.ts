import { DEFAULT_LOCALE } from './locale.config'

export type AppConfig = {
  apiPrefix: string
  authenticatedEntryPath: string
  unAuthenticatedEntryPath: string
  locale: string
  googleClientId: string
}

const appConfig: AppConfig = {
  apiPrefix: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000',
  authenticatedEntryPath: '/admin',
  unAuthenticatedEntryPath: '/sign-in',
  locale: DEFAULT_LOCALE,
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID || '',
}

export default appConfig
