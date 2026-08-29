/**
 * Global currency configuration.
 * Change values here to update currency display across the entire app.
 */
const currencyConfig = {
  /** ISO 4217 currency code */
  code: 'UAH',

  /** Currency symbol (for compact display if needed) */
  symbol: '₴',

  /** String prepended before the formatted number. Include trailing space. */
  prefix: 'UAH ',

  /** String appended after the formatted number. Empty = prefix mode. */
  suffix: '',

  /** Decimal places */
  decimalScale: 2,

  /** Whether to insert thousand separators */
  thousandSeparator: true,
} as const

export default currencyConfig
