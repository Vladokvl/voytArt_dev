import { useTranslations } from 'next-intl'

/**
 * Translation hook for Client Components.
 * Requires 'use client' because it uses React hooks.
 *
 * For Server Components, use getServerTranslation from '@/i18n/server' instead.
 * This keeps components as Server Components by default and avoids unnecessary client bundles.
 */
export const useTranslation = (namespace?: string) => {
  return useTranslations(namespace)
}

export default useTranslation
