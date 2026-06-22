export type CartLine = {
  id: string;
  quantity: number;
  title: string;
};

export type CartSummaryData = {
  id: string;
  checkoutUrl: string;
  totalAmount: string;
  currencyCode: string;
  lines: CartLine[];
};
