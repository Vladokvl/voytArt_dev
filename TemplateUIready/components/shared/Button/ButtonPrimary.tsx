import React from 'react'
import Button, { ButtonProps } from './Button'

const ButtonPrimary: React.FC<ButtonProps> = ({ className = '', ...props }) => {
  return (
    <Button
      className={`bg-neutral-900 text-neutral-50 shadow-xl hover:bg-neutral-800 disabled:bg-neutral-900/90 dark:bg-neutral-100 dark:text-neutral-800 dark:hover:bg-neutral-200 ${className}`}
      {...props}
    />
  )
}

export default ButtonPrimary
