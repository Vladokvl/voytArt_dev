'use client'

import clsx from 'clsx'
import type React from 'react'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'
import Button from '../Button/Button'
import useTranslation from '@/utils/hooks/useTranslation'

export function Pagination({
  'aria-label': ariaLabel,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'nav'>) {
  const t = useTranslation('common')
  const label = ariaLabel ?? t('pageNavigation')
  return <nav aria-label={label} {...props} className={clsx(className, 'flex gap-x-5')} />
}

export function PaginationPrevious({
  href = null,
  className,
  children,
}: React.PropsWithChildren<{ href?: string | null; className?: string }>) {
  const t = useTranslation('common')
  return (
    <span className={clsx(className, 'grow basis-0')}>
      <Button
        {...(href === null ? { disabled: true } : { href })}
        className="rounded-lg"
        aria-label={t('previousPage')}
      >
        <HiArrowLeft size={16} className="me-2" />

        {children ?? t('prev')}
      </Button>
    </span>
  )
}

export function PaginationNext({
  href = null,
  className,
  children,
}: React.PropsWithChildren<{ href?: string | null; className?: string }>) {
  const t = useTranslation('common')
  return (
    <span className={clsx(className, 'flex grow basis-0 justify-end')}>
      <Button
        {...(href === null ? { disabled: true } : { href })}
        className="rounded-lg"
        aria-label={t('nextPage')}
      >
        {children ?? t('next')}
        <HiArrowRight size={16} className="ms-2" />
      </Button>
    </span>
  )
}

export function PaginationList({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return <span {...props} className={clsx(className, 'hidden items-baseline gap-x-2 sm:flex')} />
}

export function PaginationPage({
  href,
  className,
  current = false,
  children,
}: React.PropsWithChildren<{ href: string; className?: string; current?: boolean }>) {
  return (
    <Button
      href={href}
      aria-label={`Page ${children}`}
      aria-current={current ? 'page' : undefined}
      className={clsx(
        className,
        'min-w-[2.25rem] rounded-lg before:absolute before:-inset-px before:rounded-lg',
        current && 'before:bg-neutral-950/5 dark:before:bg-white/10'
      )}
    >
      <span className="-mx-0.5">{children}</span>
    </Button>
  )
}

export function PaginationGap({
  className,
  children = <>&hellip;</>,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      aria-hidden="true"
      {...props}
      className={clsx(
        className,
        'w-[2.25rem] text-center text-sm/6 font-semibold text-neutral-950 select-none dark:text-white'
      )}
    >
      {children}
    </span>
  )
}
