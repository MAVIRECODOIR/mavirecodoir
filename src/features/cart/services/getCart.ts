import { getCart as getMedusaCart } from "../../../lib/medusa/cart";
import type { CartSummaryData } from "../types/cart.types";

export async function getCart(cartId: string): Promise<CartSummaryData | null> {
  const cart = await getMedusaCart(cartId);

  if (!cart) {
    return null;
  }

  return {
    id: cart.id,
    checkoutUrl: "", // Medusa handles checkout differently
    totalAmount: String(cart.total || 0),
    currencyCode: cart.region?.currency_code || "USD",
    lines: cart.items?.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      title: item.title,
    })) || [],
  };
}
