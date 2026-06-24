import { formatPrice } from '@/lib/utils/format'

interface PriceProps {
  amount: number | null | undefined
  originalAmount?: number | null
  currencyCode: string
  locale: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { fontSize: '0.8rem' },
  md: { fontSize: '1rem' },
  lg: { fontSize: '1.25rem', letterSpacing: '0.02em' },
}

export function Price({
  amount,
  originalAmount,
  currencyCode,
  locale,
  size = 'md',
  className,
}: PriceProps) {
  const isOnSale = originalAmount != null && amount != null && amount < originalAmount

  return (
    <span style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'baseline', ...sizeStyles[size] }} className={className}>
      {isOnSale && (
        <span style={{ color: '#999', textDecoration: 'line-through', fontWeight: 300 }}>
          {formatPrice(originalAmount, currencyCode, locale)}
        </span>
      )}
      <span style={{ color: isOnSale ? '#c0392b' : 'inherit', fontWeight: 400 }}>
        {formatPrice(amount, currencyCode, locale)}
      </span>
    </span>
  )
}

export function ProductPrice({
  variant,
  region,
  locale,
  size,
}: {
  variant: any
  region: any
  locale: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const currency = region?.currency_code ?? 'GBP'
  const calculated = variant?.calculated_price

  return (
    <Price
      amount={calculated?.calculated_amount}
      originalAmount={calculated?.original_amount}
      currencyCode={currency}
      locale={locale}
      size={size}
    />
  )
}
