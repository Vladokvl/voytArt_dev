'use client'

import { useEffect, useState } from 'react'
import isBrowser from '../isBrowser'

// Tailwind breakpoints
const breakpoints = {
  '2xl': 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
  xs: 576,
} as const

type Breakpoint = keyof typeof breakpoints

interface ScreenSize {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
  breakpoint: Breakpoint
  isLargerThan: (breakpoint: Breakpoint) => boolean
  isSmallerThan: (breakpoint: Breakpoint) => boolean
  isBetween: (min: Breakpoint, max: Breakpoint) => boolean
}

const getScreenSize = (): ScreenSize => {
  if (!isBrowser) {
    return {
      width: 0,
      height: 0,
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isLargeDesktop: false,
      breakpoint: 'md',
      isLargerThan: () => false,
      isSmallerThan: () => false,
      isBetween: () => false,
    }
  }

  const width = window.innerWidth
  const height = window.innerHeight

  // Determine current breakpoint
  let breakpoint: Breakpoint = 'xs'
  if (width >= breakpoints['2xl']) breakpoint = '2xl'
  else if (width >= breakpoints.xl) breakpoint = 'xl'
  else if (width >= breakpoints.lg) breakpoint = 'lg'
  else if (width >= breakpoints.md) breakpoint = 'md'
  else if (width >= breakpoints.sm) breakpoint = 'sm'
  else breakpoint = 'xs'

  // Device type helpers
  const isMobile = width < breakpoints.md
  const isTablet = width >= breakpoints.md && width < breakpoints.lg
  const isDesktop = width >= breakpoints.lg && width < breakpoints['2xl']
  const isLargeDesktop = width >= breakpoints['2xl']

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoint,
    isLargerThan: (bp: Breakpoint) => width > breakpoints[bp],
    isSmallerThan: (bp: Breakpoint) => width < breakpoints[bp],
    isBetween: (min: Breakpoint, max: Breakpoint) =>
      width >= breakpoints[min] && width < breakpoints[max],
  }
}

const SSR_DEFAULTS: ScreenSize = {
  width: 0,
  height: 0,
  isMobile: false,
  isTablet: false,
  isDesktop: false,
  isLargeDesktop: false,
  breakpoint: 'md',
  isLargerThan: () => false,
  isSmallerThan: () => false,
  isBetween: () => false,
}

const useScreenSize = (): ScreenSize => {
  // Always start with SSR-safe defaults so server and client initial render match
  const [screenSize, setScreenSize] = useState<ScreenSize>(SSR_DEFAULTS)

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize())
    }

    // Measure after mount (safe to access window here)
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return screenSize
}

export default useScreenSize
export type { Breakpoint, ScreenSize }
