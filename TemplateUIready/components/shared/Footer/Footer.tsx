'use client'

import Logo from '@/components/shared/Logo/Logo'
import SocialsList1 from '@/components/shared/SocialsList1/SocialsList1'
import useTranslation from '@/utils/hooks/useTranslation'
import React from 'react'

export interface WidgetFooterMenu {
  id: string
  titleKey: string
  menuKeys: string[]
}

const widgetMenus: WidgetFooterMenu[] = [
  {
    id: '5',
    titleKey: 'gettingStarted',
    menuKeys: ['releaseNotes', 'upgradeGuide', 'browserSupport', 'darkMode'],
  },
  {
    id: '1',
    titleKey: 'explore',
    menuKeys: ['prototyping', 'designSystems', 'pricing', 'security'],
  },
  {
    id: '2',
    titleKey: 'resources',
    menuKeys: ['bestPractices', 'support', 'developers', 'learnDesign'],
  },
  {
    id: '4',
    titleKey: 'community',
    menuKeys: ['discussionForums', 'codeOfConduct', 'contributing', 'apiReference'],
  },
]

const Footer: React.FC = () => {
  const t = useTranslation('footer')
  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">{t(menu.titleKey)}</h2>
        <ul className="mt-5 space-y-4">
          {menu.menuKeys.map((key, i) => (
            <li key={i}>
              <a
                className="text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                href="/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="nc-Footer relative border-t border-neutral-200 py-10 lg:pt-14 lg:pb-12 dark:border-neutral-700">
      <div className="container grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 mx-auto px-4">
        <div className="col-span-2 grid grid-cols-4 gap-5 md:col-span-4 lg:flex lg:flex-col lg:md:col-span-1">
          <div className="col-span-2 md:col-span-1">
            <Logo />
          </div>
          <div className="col-span-2 flex items-center md:col-span-3">
            <SocialsList1 className="flex items-center space-x-2 lg:flex-col lg:items-start lg:space-y-3 lg:space-x-0" />
          </div>
        </div>
        {widgetMenus.map(renderWidgetMenuItem)}
      </div>
    </div>
  )
}

export default Footer
