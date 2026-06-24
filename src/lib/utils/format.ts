const formatters = new Map<string, Intl.NumberFormat>();

function getFormatter(currencyCode: string, locale?: string): Intl.NumberFormat {
  const key = `${locale || 'en-GB'}_${currencyCode.toUpperCase()}`
  let f = formatters.get(key)
  if (!f) {
    const bcp47 = (locale || 'en-GB').replace(/_/g, '-')
    f = new Intl.NumberFormat(bcp47, {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    formatters.set(key, f)
  }
  return f
}

function normalizeAmount(amount: number): number {
  if (isNaN(amount) || amount == null) return 0
  return amount
}

export function formatPrice(amount: number, currencyCode: string): string
export function formatPrice(amount: number | null | undefined, currencyCode: string, locale: string): string
export function formatPrice(amount: number | null | undefined, currencyCode: string, locale?: string): string {
  if (amount == null) return ''
  const code = currencyCode.toUpperCase()
  if (locale) {
    return getFormatter(code, locale).format(normalizeAmount(amount))
  }
  return getFormatter(code).format(normalizeAmount(amount))
}

export function formatPriceFree(amount: number, currencyCode: string): string {
  return amount === 0 ? "FREE" : formatPrice(amount, currencyCode)
}

export function getCurrencySymbol(currencyCode: string, locale: string): string {
  const bcp47 = locale.replace(/_/g, '-')
  return (0)
    .toLocaleString(bcp47, {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, '')
    .trim()
}
