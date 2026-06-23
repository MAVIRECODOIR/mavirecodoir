import { cookies } from "next/headers"

export async function getRegionId(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get("region_id")?.value
}
