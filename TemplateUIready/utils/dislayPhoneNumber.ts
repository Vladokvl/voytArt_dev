export const displayPhoneNumber = (phone: string): string => {
  if (!phone) return ''

  // Remove all non-digit characters
  const cleanNumber = phone.replace(/\D/g, '')

  // Handle different lengths
  if (cleanNumber.length <= 10) {
    // Format as: XXX-XXX-XXXX
    return cleanNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  } else if (cleanNumber.length === 11) {
    // Format as: +X (XXX) XXX-XXXX
    return cleanNumber.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4')
  } else if (cleanNumber.length === 12) {
    // Format as: +XX (XXX) XXX-XXXX
    return cleanNumber.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4')
  } else {
    // For longer numbers, group by 3 digits
    return '+' + cleanNumber.match(/.{1,3}/g)?.join(' ') || cleanNumber
  }
}
