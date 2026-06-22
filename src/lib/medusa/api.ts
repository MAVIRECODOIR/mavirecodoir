const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY || ""

type MedusaFetchOptions = {
  method?: string
  body?: unknown
  /** JWT token from Medusa auth */
  token?: string
}

async function medusaFetch<T>(
  path: string,
  options: MedusaFetchOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-publishable-api-key": PUBLISHABLE_KEY,
  }

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`
  }

  const res = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Medusa API error: ${res.status}`)
  }

  return res.json()
}

type AuthResult = { token: string }

export async function registerCustomer(email: string, password: string): Promise<AuthResult> {
  return medusaFetch<AuthResult>(`/auth/customer/emailpass/register`, {
    method: "POST",
    body: { email, password },
  })
}

export async function createCustomer(
  data: { first_name?: string; last_name?: string; phone?: string; email?: string },
  token: string
) {
  return medusaFetch<{ customer: Record<string, unknown> }>(`/store/customers`, {
    method: "POST",
    body: data,
    token,
  })
}

export async function loginCustomer(email: string, password: string): Promise<AuthResult> {
  return medusaFetch<AuthResult>(`/auth/customer/emailpass`, {
    method: "POST",
    body: { email, password },
  })
}

export async function getCustomer(token?: string) {
  return medusaFetch<{ customer: Record<string, unknown> }>(`/store/customers/me`, {
    token,
  })
}

export async function updateCustomer(
  data: Record<string, unknown>,
  token?: string
) {
  return medusaFetch<{ customer: Record<string, unknown> }>(`/store/customers/me`, {
    method: "POST",
    body: data,
    token,
  })
}

export async function changePassword(password: string, token: string) {
  return medusaFetch<{ success: boolean }>(`/auth/customer/emailpass/update`, {
    method: "POST",
    body: { password },
    token,
  })
}

export async function getOrders(token?: string) {
  return medusaFetch<{ orders: Record<string, unknown>[] }>(`/store/orders`, {
    token,
  })
}
