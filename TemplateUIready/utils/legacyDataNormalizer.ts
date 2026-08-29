type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

const explicitLegacyKeyMap: Record<string, string> = {
  _id: 'id',
  meta_title: 'metaTitle',
  meta_description: 'metaDescription',
  full_address: 'fullAddress',
  manual_address_validation: 'manualAddressValidation',
  phone_formatted: 'phoneFormatted',
}

function snakeToCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase())
}

function resolveCanonicalKey(key: string): string {
  return explicitLegacyKeyMap[key] ?? (key.includes('_') ? snakeToCamel(key) : key)
}

export function normalizeLegacyData<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => normalizeLegacyData(item)) as T
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const record = value as Record<string, JsonValue>
  const normalized: Record<string, JsonValue> = {}

  Object.entries(record).forEach(([key, rawValue]) => {
    const nextValue = normalizeLegacyData(rawValue)
    const canonicalKey = resolveCanonicalKey(key)

    normalized[key] = nextValue
    if (!(canonicalKey in normalized)) {
      normalized[canonicalKey] = nextValue
    }
  })

  return normalized as T
}
