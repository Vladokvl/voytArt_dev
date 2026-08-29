import useCurrentSession from '@/utils/hooks/useCurrentSession'
import useNavigation from '@/utils/hooks/useNavigation'
import useTheme from '@/utils/hooks/useTheme'
import queryRoute from '@/utils/queryRoute'
import { usePathname } from '@/i18n/navigation'
import { useState } from 'react'
import MobileNavContent from './MobileNavContent'

const MobileNav = ({
  translationSetup = true,
}: {
  translationSetup?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const direction = useTheme(state => state.direction)

  const pathname = usePathname()

  const route = queryRoute(pathname)

  const currentRouteKey = route?.key || ''

  const { user } = useCurrentSession()

  const { navigationTree } = useNavigation()

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div className="mobile-nav lg:hidden">
      <MobileNavContent
        isOpen={isOpen}
        routeKey={currentRouteKey}
        navigationTree={navigationTree}
        userAuthority={user?.authority || []}
        direction={direction}
        translationSetup={translationSetup}
        onOpen={handleOpen}
        onClose={handleClose}
      />
    </div>
  )
}

export default MobileNav
