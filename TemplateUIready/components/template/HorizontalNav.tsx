'use client'

import type { TranslationFn } from '@/@types/navigation'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import useNavigation from '@/utils/hooks/useNavigation'
import useTheme from '@/utils/hooks/useTheme'
import useTranslation from '@/utils/hooks/useTranslation'
import queryRoute from '@/utils/queryRoute'
import { usePathname } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import HorizontalMenuContent from './HorizontalMenuContent'

const HorizontalNav = ({
  translationSetup = true,
}: {
  translationSetup?: boolean
}) => {
  const [isClient, setIsClient] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setIsMounted(true)
  }, [])

  // Перевіряємо, чи всі хуки можуть бути викликані
  if (!isClient || !isMounted) {
    return <div className="horizontal-nav" />
  }

  try {
    const mode = useTheme(state => state.mode)
    const direction = useTheme(state => state.direction)
    const pathname = usePathname()
    const route = queryRoute(pathname)
    const currentRouteKey = route?.key || ''
    const { user } = useCurrentSession()
    const { navigationTree } = useNavigation()

    const translationPlaceholder = (key: string, fallback?: string) => {
      return fallback || key
    }

    const t = (translationSetup ? useTranslation() : translationPlaceholder) as TranslationFn

    const navColor = (navType: string, mode: string) => {
      return `${navType}-${mode}`
    }

    return (
      <div className="horizontal-nav">
        <HorizontalMenuContent
          className={`horizontal-menu-content ${navColor('horizontal-nav', mode)}`}
          routeKey={currentRouteKey}
          navigationTree={navigationTree}
          userAuthority={user?.authority || []}
          mode={mode}
          direction={direction}
          translationSetup={translationSetup}
          t={t as TranslationFn}
        />
      </div>
    )
  } catch (error) {
    console.error('Error in HorizontalNav:', error)
    return <div className="horizontal-nav" />
  }
}

export default HorizontalNav
