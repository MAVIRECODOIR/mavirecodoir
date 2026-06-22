import type { CartSummaryData } from "../types/cart.types";
import { formatPrice } from "@/lib/utils/format";

type CartSummaryProps = {
  cart: CartSummaryData | null;
};

export function CartSummary({ cart }: CartSummaryProps) {
  if (!cart) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Your Cart</h1>
        <p>Cart not found.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Your Cart</h1>
      <ul>
        {cart.lines.map((line) => (
          <li key={line.id}>
            {line.title} x {line.quantity}
          </li>
        ))}
      </ul>
      <p>
        Total: {formatPrice(Number(cart.totalAmount) || 0, cart.currencyCode)}
      </p>
      <a href={cart.checkoutUrl}>Proceed to checkout</a>
    </main>
  );
}
