import sdk from "./client"

export async function getShippingOptions(cartId: string) {
  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({ cart_id: cartId })
  return shipping_options
}

export async function setShippingMethod(cartId: string, optionId: string) {
  const { cart } = await sdk.store.cart.addShippingMethod(cartId, { option_id: optionId })
  return cart
}

export async function getPaymentCollection(cartId: string) {
  const response = await sdk.store.cart.retrieve(cartId)
  return (response as any).cart ?? response
}

export async function initiatePayPalSession(cartId: string) {
  const cart = await getPaymentCollection(cartId)
  const { payment_collection } = await sdk.store.payment.initiatePaymentSession(cart, {
    provider_id: "pp_paypal_paypal",
    data: {},
  })
  return payment_collection
}

export async function initiateStripeSession(cartId: string) {
  const cart = await getPaymentCollection(cartId)
  const { payment_collection } = await sdk.store.payment.initiatePaymentSession(cart, {
    provider_id: "pp_stripe_stripe",
    data: {},
  })
  return payment_collection
}

export async function completeCart(cartId: string) {
  return sdk.store.cart.complete(cartId)
}

// Find a region that includes the given country code
export async function findRegionByCountry(countryCode: string) {
  try {
    const { regions } = await sdk.store.region.list()
    if (!regions?.length) return null
    return regions.find((region: any) =>
      region.countries?.some((country: any) =>
        country.iso_2.toLowerCase() === countryCode.toLowerCase()
      )
    ) || null
  } catch (error) {
    console.error("Error finding region by country:", error)
    return null
  }
}

// Update cart region if country is not in current region
export async function updateCartRegionIfNeeded(cartId: string, countryCode: string) {
  try {
    const { cart } = await sdk.store.cart.retrieve(cartId)
    if (!cart?.region) return null

    // Check if country is in current region
    const countryInRegion = cart.region.countries?.some(
      (country: any) => country.iso_2.toLowerCase() === countryCode.toLowerCase()
    )

    if (countryInRegion) return cart // Country already in current region

    // Find a region that includes this country
    const newRegion = await findRegionByCountry(countryCode)
    if (!newRegion) {
      console.warn(`No region found for country ${countryCode}`)
      return null
    }

    // Update cart to new region
    const { cart: updatedCart } = await sdk.store.cart.update(cartId, {
      region_id: newRegion.id,
    })
    return updatedCart
  } catch (error) {
    console.error("Error updating cart region:", error)
    return null
  }
}
