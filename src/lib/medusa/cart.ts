import sdk from "./client"
import Cookies from "js-cookie"

async function getRegionIdByCurrency(currencyCode: string): Promise<string | undefined> {
  try {
    const { regions } = await sdk.store.region.list({ limit: "10" } as any)
    if (!regions?.length) return undefined
    const region = regions.find((r: any) => r.currency_code?.toLowerCase() === currencyCode.toLowerCase())
    return region?.id
  } catch {
    return undefined
  }
}

async function getDefaultRegionId(): Promise<string | undefined> {
  try {
    const { regions } = await sdk.store.region.list({ limit: "10" } as any)
    if (!regions?.length) return undefined
    const gbp = regions.find((r: any) => r.currency_code?.toLowerCase() === "gbp")
    return gbp?.id ?? regions[0].id
  } catch {
    return undefined
  }
}

let cachedRegionId: string | undefined

export async function createCart(currencyCode?: string) {
  try {
    let id: string | undefined;

    // First try to get region_id from cookie (set by RegionProvider)
    id = Cookies.get("region_id");

    // If not in cookie, try by currency code
    if (!id && currencyCode) {
      id = await getRegionIdByCurrency(currencyCode);
    }

    // If still no region, get default
    if (!id) {
      id = cachedRegionId || await getDefaultRegionId();
    }

    if (id) cachedRegionId = id
    const { cart } = await sdk.store.cart.create({
      region_id: id,
    })
    return cart.id
  } catch (error) {
    console.error("Error creating cart in Medusa:", error)
    throw new Error("Failed to create cart")
  }
}

export async function getCart(cartId: string) {
  try {
    const { cart } = await sdk.store.cart.retrieve(cartId, {
      fields: "*,items.variant.*,items.variant.options.*"
    } as any)
    return cart
  } catch (error) {
    console.error("Error fetching cart from Medusa:", error)
    return null
  }
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
) {
  try {
    const { cart } = await sdk.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    })
    return cart
  } catch (error) {
    console.error("Error adding item to cart in Medusa:", error)
    throw new Error("Failed to add item to cart")
  }
}

export async function updateCartItem(
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  try {
    const { cart } = await sdk.store.cart.updateLineItem(
      cartId,
      lineItemId,
      { quantity }
    )
    return cart
  } catch (error) {
    console.error("Error updating cart item in Medusa:", error)
    throw new Error("Failed to update cart item")
  }
}

export async function removeFromCart(cartId: string, lineItemId: string) {
  try {
    const { parent: cart } = await sdk.store.cart.deleteLineItem(
      cartId,
      lineItemId
    )
    return cart
  } catch (error) {
    console.error("Error removing item from cart in Medusa:", error)
    throw new Error("Failed to remove item from cart")
  }
}

export async function updateCartRegion(cartId: string, regionId: string) {
  try {
    const { cart } = await sdk.store.cart.update(cartId, {
      region_id: regionId,
    })
    return cart
  } catch (error) {
    console.error("Error updating cart region in Medusa:", error)
    throw new Error("Failed to update cart region")
  }
}
