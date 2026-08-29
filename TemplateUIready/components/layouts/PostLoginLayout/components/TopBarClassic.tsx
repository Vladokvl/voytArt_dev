'use client'

import type { CommonProps } from '@/@types/common'
import LayoutBase from '@/components/template/LayoutBase'
import Header from '@/components/template/Header'
import HeaderLogo from '@/components/template/HeaderLogo'
import Footer from '@/components/template/Footer'
import { LAYOUT_TOP_BAR_CLASSIC } from '@/constants/theme.constant'

const TopBarClassic = ({ children, footer = true }: CommonProps) => {
  return (
    <LayoutBase
      type={LAYOUT_TOP_BAR_CLASSIC}
      className="app-layout-top-bar-classic flex flex-auto flex-col min-h-screen"
    >
      <div className="flex flex-auto min-w-0">
        <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
          <Header className="shadow-sm dark:shadow-2xl" headerStart={<HeaderLogo />} />
          {children}
          {footer ? <Footer pageContainerType="contained" /> : null}
        </div>
      </div>
    </LayoutBase>
  )
}

export default TopBarClassic
