/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client"
import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // GSAP керує Lenis через свій ticker — вони завжди в одному кадрі.
    // Lenis емітить 'scroll' → ScrollTrigger.update читає вже оновлений window.scrollY.
    // Це канонічна інтеграція Lenis + GSAP ScrollTrigger.
    gsap.ticker.lagSmoothing(0)

    const lenis = new Lenis({
      // autoRaf: true видалено — GSAP ticker тепер є "двигуном" для Lenis
      lerp: 0.1,
      smoothWheel: true,
      anchors: true,
    })

    // Expose lenis to window so we can stop it from modals
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    ;(window as any).lenis = lenis;

    const driverFn = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(driverFn)

    // Після кожного lenis-кадру → ScrollTrigger перераховує тригери
    lenis.on('scroll', () => ScrollTrigger.update())

    return () => {
      gsap.ticker.remove(driverFn)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}