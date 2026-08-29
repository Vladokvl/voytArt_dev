'use client'

import useTheme from '@/utils/hooks/useTheme'
import classNames from '@/utils/classNames'
import { PiMoonStarsDuotone, PiSunDuotone } from 'react-icons/pi'

const ModeSwitcher = () => {
  const mode = useTheme(state => state.mode)
  const setMode = useTheme(state => state.setMode)
  const isDark = (mode ?? 'light') === 'dark'

  return (
    <div
      className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100/80 p-0.5 dark:border-gray-600 dark:bg-gray-800/80"
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        aria-pressed={!isDark}
        aria-label="Light mode"
        className={classNames(
          'flex h-8 w-8 items-center justify-center rounded-full text-lg transition-colors',
          !isDark
            ? 'bg-white text-amber-500 shadow-sm dark:bg-gray-700'
            : 'text-gray-400 hover:text-gray-300',
        )}
        onClick={() => setMode('light')}
      >
        <PiSunDuotone />
      </button>
      <button
        type="button"
        aria-pressed={isDark}
        aria-label="Dark mode"
        className={classNames(
          'flex h-8 w-8 items-center justify-center rounded-full text-lg transition-colors',
          isDark
            ? 'bg-gray-700 text-indigo-300 shadow-sm dark:bg-gray-900'
            : 'text-gray-500 hover:text-gray-700',
        )}
        onClick={() => setMode('dark')}
      >
        <PiMoonStarsDuotone />
      </button>
    </div>
  )
}

export default ModeSwitcher
