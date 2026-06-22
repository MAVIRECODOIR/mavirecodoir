import { CartSummary } from "./components/CartSummary";
import { getCart } from "./services/getCart";

type CartPageProps = {
  cartId: string;
};

export async function CartPage({ cartId }: CartPageProps) {
  const cart = await getCart(cartId);

  return CartSummary({ cart });
}
