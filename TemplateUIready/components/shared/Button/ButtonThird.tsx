import Button, { ButtonProps } from '@/components/shared/Button/Button'
import clsx from 'clsx'
import React from 'react'

const ButtonThird: React.FC<ButtonProps> = ({
  className = 'text-neutral-700 border border-neutral-200 dark:text-neutral-200 dark:border-neutral-700',
  ...props
}) => {
  return <Button className={clsx(className)} {...props} />
}

export default ButtonThird
