const formatters = new Map<string, Intl.NumberFormat>();

function getFormatter(currencyCode: string): Intl.NumberFormat {
  const code = currencyCode.toUpperCase();
  let f = formatters.get(code);
  if (!f) {
    f = new Intl.NumberFormat("en-GB", { style: "currency", currency: code, minimumFractionDigits: 2, maximumFractionDigits: 2 });
    formatters.set(code, f);
  }
  return f;
}

function normalizeAmount(amount: number): number {
  if (isNaN(amount) || amount == null) return 0;
  // Medusa stores amounts in cents (integers). 
  // If amount >= 100, assume it's in cents and divide by 100.
  // If amount < 100, assume it's already in decimal format (e.g., 1.05 for £1.05).
  return amount >= 100 ? amount / 100 : amount;
}

export function formatPrice(amount: number, currencyCode: string): string {
  return getFormatter(currencyCode).format(normalizeAmount(amount));
}

export function formatPriceFree(amount: number, currencyCode: string): string {
  return amount === 0 ? "FREE" : formatPrice(amount, currencyCode);
}


