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
  // Medusa v2 stores prices as the actual decimal amount (not in cents).
  // For example, £5.00 is stored as 5, not 500.
  return amount;
}

export function formatPrice(amount: number, currencyCode: string): string {
  return getFormatter(currencyCode).format(normalizeAmount(amount));
}

export function formatPriceFree(amount: number, currencyCode: string): string {
  return amount === 0 ? "FREE" : formatPrice(amount, currencyCode);
}


