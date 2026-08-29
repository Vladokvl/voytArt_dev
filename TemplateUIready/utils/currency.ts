import currencyConfig from '@/configs/currency.config'

/**
 * Format a numeric value as a currency string using the global currency config.
 * Change the config once → updates everywhere this function is called.
 *
 * @example
 * currency(500)      // → "UAH 500.00"
 * currency(1500.5)   // → "UAH 1,500.50"
 * currency(null)     // → "—"
 */
export function currency(value: number | string | null | undefined): string {
  if (value == null) return '—'
  const num = Number(value)
  if (isNaN(num)) return '—'

  const [intPart, decPart] = num.toFixed(currencyConfig.decimalScale).split('.')

  const formattedInt = currencyConfig.thousandSeparator
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : intPart

  const formatted = `${formattedInt}.${decPart}`

  return `${currencyConfig.prefix}${formatted}${currencyConfig.suffix}`.trim()
}

/**
 * Props to spread onto a <NumericFormat displayType="text"> component.
 * Keeps JSX rendering consistent with the global currency config.
 *
 * @example
 * <NumericFormat displayType="text" value={price} {...currencyFormatProps} />
 */
export const currencyFormatProps = {
  thousandSeparator: currencyConfig.thousandSeparator,
  decimalScale: currencyConfig.decimalScale,
  fixedDecimalScale: true,
  prefix: currencyConfig.prefix || undefined,
  suffix: currencyConfig.suffix || undefined,
} as const
