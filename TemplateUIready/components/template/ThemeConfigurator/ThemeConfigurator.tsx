'use client'

import ModeSwitcher from './ModeSwitcher'
import LayoutSwitcher from './LayoutSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import DirectionSwitcher from './DirectionSwitcher'
import CopyButton from './CopyButton'
import useTranslation from '@/utils/hooks/useTranslation'

const ThemeConfigurator = () => {
  const t = useTranslation('common')
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col gap-y-10 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h6>{t('darkMode')}</h6>
            <span>{t('switchDarkMode')}</span>
          </div>
          <ModeSwitcher />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h6>{t('direction')}</h6>
            <span>{t('selectDirection')}</span>
          </div>
          <DirectionSwitcher />
        </div>
        <div>
          <h6 className="mb-3">{t('themeConfig')}</h6>
          <ThemeSwitcher />
        </div>
        <div>
          <h6 className="mb-3">{t('layout')}</h6>
          <LayoutSwitcher />
        </div>
      </div>
      <CopyButton />
    </div>
  )
}

export default ThemeConfigurator
