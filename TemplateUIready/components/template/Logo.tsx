import classNames from '@/utils/classNames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface LogoProps extends CommonProps {
  type?: 'full' | 'streamline'
  mode?: 'light' | 'dark'
  imgClass?: string
  logoWidth?: number
  logoHeight?: number
}

const Logo = (props: LogoProps) => {
  const { type = 'full', mode = 'light', className, style } = props
  const isStreamline = type === 'streamline'
  const isDark = mode === 'dark'

  return (
    <div
      className={classNames('logo flex items-center select-none', className)}
      style={style}
      aria-label={APP_NAME}
    >
      {isStreamline ? (
        <span
          className={classNames(
            'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg font-bold',
            'bg-primary text-white shadow-sm',
          )}
        >
          S
        </span>
      ) : (
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight leading-none">
            <span className="text-primary">S</span>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>ircle</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 pb-0.5">
            Admin
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo
