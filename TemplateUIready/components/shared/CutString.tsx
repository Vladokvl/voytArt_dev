'use client'

import React, { useState } from 'react'
import useTranslation from '@/utils/hooks/useTranslation'

const cutString = (str: string, maxLength: number = 20): string => {
  if (!str || typeof str !== 'string') {
    return ''
  }

  if (str.length <= maxLength) {
    return str
  }

  return str.slice(0, maxLength) + '...'
}

const shouldCutString = (str: string, maxLength: number = 20): boolean => {
  if (!str || typeof str !== 'string') {
    return false
  }

  return str.length > maxLength
}

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      textArea.remove()
      return result
    }
  } catch (error) {
    console.error('Failed to copy text:', error)
    return false
  }
}

interface CutStringProps {
  text: string
  maxLength?: number
  className?: string
  showCopyButton?: boolean
  copyButtonText?: string
  copySuccessText?: string
}

export const CutString: React.FC<CutStringProps> = ({
  text,
  maxLength = 30,
  className = '',
  showCopyButton = true,
  copyButtonText,
  copySuccessText,
}) => {
  const t = useTranslation('common')
  const [isExpanded, setIsExpanded] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle')

  const needsCut = shouldCutString(text, maxLength)
  const displayText = isExpanded ? text : cutString(text, maxLength)

  const handleTextClick = () => {
    if (needsCut) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleCopyClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    setCopyStatus('copying')
    const success = await copyToClipboard(text)

    if (success) {
      setCopyStatus('success')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } else {
      setCopyStatus('error')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }

  const getCopyButtonContent = () => {
    switch (copyStatus) {
      case 'copying':
        return t('copying')
      case 'success':
        return copySuccessText ?? t('copied')
      case 'error':
        return t('error')
      default:
        return copyButtonText ?? t('copy')
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        onClick={handleTextClick}
        className={`${needsCut ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
        title={needsCut ? 'Click to expand/collapse' : ''}
      >
        {displayText}
      </span>

      {showCopyButton && (
        <button
          onClick={handleCopyClick}
          className={`
            px-2 py-1 text-xs rounded border transition-all duration-200
            ${
              copyStatus === 'success'
                ? 'bg-green-100 text-green-700 border-green-300'
                : copyStatus === 'error'
                  ? 'bg-red-100 text-red-700 border-red-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }
          `}
          title={t('copyToClipboard')}
          disabled={copyStatus === 'copying'}
        >
          {getCopyButtonContent()}
        </button>
      )}
    </div>
  )
}

export default CutString
