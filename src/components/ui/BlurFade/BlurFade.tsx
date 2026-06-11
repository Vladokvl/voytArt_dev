'use client'

import { motion } from 'framer-motion'

interface BlurFadeProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export default function BlurFade({ children, delay = 0, className }: BlurFadeProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
