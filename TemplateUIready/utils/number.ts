export function coerceNumber(value: unknown): number | null {
  if (value == null) {
    return null
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) {
      return null
    }

    const parsed = Number(trimmed)
    return Number.isFinite(parsed) ? parsed : null
  }

  if (typeof value === 'bigint') {
    return Number(value)
  }

  return null
}

export function formatPercent(value: unknown, fractionDigits = 1): string {
  const num = coerceNumber(value)
  if (num == null) {
    return '—'
  }

  return `${num.toFixed(fractionDigits)}%`
}
