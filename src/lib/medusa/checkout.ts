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
