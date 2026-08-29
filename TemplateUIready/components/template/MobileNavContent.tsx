'use client'

import { Suspense, lazy } from 'react'
import classNames from 'classnames'
import Drawer from '@/components/ui/Drawer'
import NavToggle from '@/components/shared/NavToggle'
import { DIR_RTL } from '@/constants/theme.constant'
import withHeaderItem, { WithHeaderItemProps } from '@/utils/hoc/withHeaderItem'
import useTranslation from '@/utils/hooks/useTranslation'
import type { NavigationTree } from '@/@types/navigation'
import type { Direction } from '@/@types/theme'

const VerticalMenuContent = lazy(() => import('@/components/template/VerticalMenuContent'))

type MobileNavToggleProps = {
  toggled?: boolean
}

type MobileNavContentProps = {
  isOpen: boolean
  routeKey: string
  navigationTree?: NavigationTree[]
  userAuthority: string[]
  direction?: Direction
  translationSetup?: boolean
  onOpen: () => void
  onClose: () => void
}

const MobileNavToggle = withHeaderItem<MobileNavToggleProps & WithHeaderItemProps>(NavToggle)

const MobileNavContent = ({
  isOpen,
  routeKey,
  navigationTree = [],
  userAuthority,
  direction,
  translationSetup = false,
  onOpen,
  onClose,
}: MobileNavContentProps) => {
  const t = useTranslation('common')
  return (
    <>
      <div className="text-2xl block lg:hidden" onClick={onOpen}>
        <MobileNavToggle toggled={isOpen} />
      </div>
      <Drawer
        title={t('navigationTitle')}
        isOpen={isOpen}
        bodyClass={classNames('p-0')}
        width={330}
        placement={direction === DIR_RTL ? 'right' : 'left'}
        onClose={onClose}
        onRequestClose={onClose}
      >
        <Suspense fallback={<></>}>
          {isOpen && (
            <VerticalMenuContent
              collapsed={false}
              navigationTree={navigationTree}
              routeKey={routeKey}
              userAuthority={userAuthority}
              translationSetup={translationSetup}
              direction={direction}
              onMenuItemClick={onClose}
            />
          )}
        </Suspense>
      </Drawer>
    </>
  )
}

export default MobileNavContent
