import React from 'react'
import { HiX } from 'react-icons/hi'

export interface ButtonCloseProps {
  className?: string
  IconclassName?: string
  onClick?: () => void
}

const ButtonClose: React.FC<ButtonCloseProps> = ({
  className = '',
  IconclassName = 'w-5 h-5',
  onClick = () => {},
}) => {
  return (
    <button
      className={`flex h-8 w-8 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 ${className}`}
      onClick={onClick}
    >
      <span className="sr-only">Close</span>
      <HiX className={IconclassName} />
    </button>
  )
}

export default ButtonClose
