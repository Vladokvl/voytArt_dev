'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import appConfig from '@/configs/app.config'
import useTranslation from '@/utils/hooks/useTranslation'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { Link, useRouter } from '@/i18n/navigation'
import { PiDatabaseDuotone, PiSignOutDuotone, PiUserDuotone } from 'react-icons/pi'

import type { JSX } from 'react'

type DropdownList = {
  label: string
  path: string
  icon: JSX.Element
}

const _UserDropdown = () => {
  const t = useTranslation('common')
  const { user, signOut } = useAuth()
  const router = useRouter()

  const dropdownItemList: DropdownList[] = [
    ...(user?.authority?.includes('admin')
      ? [
          {
            label: t('adminPanel'),
            path: '/admin',
            icon: <PiDatabaseDuotone />,
          },
        ]
      : []),
  ]

  const handleSignOut = () => {
    signOut()
    router.push(appConfig.unAuthenticatedEntryPath)
  }

  const avatarProps = {
    ...(user?.avatar ? { src: user.avatar } : { icon: <PiUserDuotone /> }),
  }

  return (
    <Dropdown
      className="flex"
      toggleClassName="flex items-center"
      renderTitle={
        <div className="cursor-pointer flex items-center">
          <Avatar size={32} {...avatarProps} />
        </div>
      }
      placement="bottom-end"
    >
      <Dropdown.Item variant="header">
        <div className="py-2 px-3 flex items-center gap-3">
          <Avatar {...avatarProps} />
          <div>
            <div className="font-bold text-gray-900 dark:text-gray-100">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.userName || t('anonymous')}
            </div>
            <div className="text-xs">{user?.email || t('noEmailAvailable')}</div>
          </div>
        </div>
      </Dropdown.Item>
      <Dropdown.Item variant="divider" />
      {dropdownItemList.map(item => (
        <Dropdown.Item key={item.label} eventKey={item.label} className="px-0">
          <Link className="flex h-full w-full px-2" href={item.path}>
            <span className="flex gap-2 items-center w-full">
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </span>
          </Link>
        </Dropdown.Item>
      ))}
      <Dropdown.Item eventKey="Sign Out" className="gap-2" onClick={handleSignOut}>
        <span className="text-xl">
          <PiSignOutDuotone />
        </span>
        <span>{t('signOut')}</span>
      </Dropdown.Item>
    </Dropdown>
  )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
