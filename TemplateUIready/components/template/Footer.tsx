'use client'

import Container from '@/components/shared/Container'
import classNames from '@/utils/classNames'
import { APP_NAME } from '@/constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'
import { useTranslations } from 'next-intl'

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
  pageContainerType: FooterPageContainerType
  className?: string
  position?: 'center' | 'left' | 'right'
}

/** After 15 Jul 2026 (inclusive through that day) → calibersystems.io */
const CALIBER_SITE_SWITCH_AT = new Date('2026-07-16T00:00:00')

function getCaliberSystemsUrl(): string {
  return new Date() < CALIBER_SITE_SWITCH_AT
    ? 'https://caliber-agency.com'
    : 'https://calibersystems.io'
}

const FooterContent = ({ position = 'left' }: { position?: 'center' | 'left' | 'right' }) => {
  const t = useTranslations('common')
  const year = new Date().getFullYear()
  const caliberUrl = getCaliberSystemsUrl()

  return (
    <div
      className={classNames(
        'flex flex-auto w-full flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4',
        position === 'center' && 'items-center text-center sm:justify-center',
        position === 'right' && 'items-end text-right sm:justify-end',
        position === 'left' && 'items-start text-left sm:justify-start'
      )}
    >
      <span className="text-gray-600 dark:text-gray-400">
        {t('footerCopyright', { year, appName: APP_NAME })}
      </span>
      <span
        className="hidden h-4 w-px shrink-0 bg-gray-300 sm:inline-block dark:bg-gray-600"
        aria-hidden
      />
      <span className="text-gray-500 dark:text-gray-400">
        {t('footerDevelopedBy')}{' '}
        <a
          href={caliberUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary transition-colors hover:text-primary-deep hover:underline"
        >
          {t('footerCaliberSystems')}
        </a>
      </span>
    </div>
  )
}

export default function Footer({
  pageContainerType = 'contained',
  className,
  position = 'left',
}: FooterProps) {
  return (
    <footer
      className={classNames(
        `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X} `,
        className
      )}
    >
      {pageContainerType === 'contained' ? (
        <Container>
          <FooterContent position={position} />
        </Container>
      ) : (
        <FooterContent position={position} />
      )}
    </footer>
  )
}
