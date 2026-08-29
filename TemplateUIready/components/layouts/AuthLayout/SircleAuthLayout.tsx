import type { CommonProps } from '@/@types/common'
import classNames from '@/utils/classNames'

const SircleAuthLayout = ({ children, className }: CommonProps) => {
  return (
    <div
      className={classNames(
        'relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6',
        'bg-gray-50 dark:bg-gray-950',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl dark:bg-primary/20" />
        <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-px w-[min(90vw,520px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] rounded-2xl border border-gray-200/80 bg-white p-8 shadow-xl shadow-gray-200/50 dark:border-gray-700/80 dark:bg-gray-900 dark:shadow-none sm:p-10">
        {children}
      </div>
    </div>
  )
}

export default SircleAuthLayout
