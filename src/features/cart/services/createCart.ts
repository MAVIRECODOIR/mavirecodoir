import { createCart as createMedusaCart } from "../../../lib/medusa/cart";

export async function createCart(): Promise<string> {
  return await createMedusaCart();
}
