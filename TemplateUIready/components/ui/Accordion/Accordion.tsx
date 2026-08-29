'use client'

import { useEffect, useRef, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'

interface AccordionProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  overflowHidden?: boolean
}

const Accordion = ({
  title,
  icon,
  children,
  defaultOpen = true,
  className = '',
  overflowHidden = true,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0
  )
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setContentHeight(contentRef.current.scrollHeight)
      } else {
        setContentHeight(0)
      }
    }
  }, [isOpen, children])

  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full px-2 items-center justify-between py-4 text-left focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <HiChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={` transition-all duration-200 ease-in-out ${overflowHidden ? 'overflow-hidden' : isOpen ? 'overflow-visible' : 'overflow-hidden'}`}
        style={{ height: contentHeight }}
      >
        <div ref={contentRef} className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Accordion
