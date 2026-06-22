interface PayPalButtonsComponent {
  render: (container: HTMLElement | string) => Promise<void>
  close?: () => void
}

interface PayPalSDK {
  Buttons: (options: {
    createOrder: () => string | Promise<string>
    onApprove: (data: Record<string, unknown>, actions?: Record<string, unknown>) => void | Promise<void>
    onError?: (err: unknown) => void
    onCancel?: () => void
    [key: string]: unknown
  }) => PayPalButtonsComponent
}

interface Window {
  paypal?: PayPalSDK
}
