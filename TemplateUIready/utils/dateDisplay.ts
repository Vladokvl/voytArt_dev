import dayjs from 'dayjs'

export const formatDate = (dateString: string, format: string = 'DD.MM.YYYY HH:mm'): string => {
  try {
    const date = dayjs(dateString)

    if (!date.isValid()) {
      throw new Error('Invalid date string')
    }

    return date.format(format)
  } catch {
    return 'Invalid date'
  }
}

/**
 * Common date format presets
 */
export const DATE_FORMATS = {
  SHORT: 'DD.MM.YYYY',
  MEDIUM: 'DD.MM.YYYY HH:mm',
  LONG: 'DD.MM.YYYY HH:mm:ss',
  TIME_ONLY: 'HH:mm',
} as const
