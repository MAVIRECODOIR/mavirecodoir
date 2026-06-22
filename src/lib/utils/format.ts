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

export function formatPrice(amount: number, currencyCode: string): string {
  return getFormatter(currencyCode).format(amount);
}

export function formatPriceFree(amount: number, currencyCode: string): string {
  return amount === 0 ? "FREE" : formatPrice(amount, currencyCode);
}


