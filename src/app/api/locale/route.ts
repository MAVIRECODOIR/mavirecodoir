import { NextRequest, NextResponse } from "next/server";
import { getLocaleByCountryCode, localeToPreferences, DEFAULT_LOCALE, COOKIE_NAMES } from "@/lib/locale";

export async function GET(req: NextRequest) {
  // Check if user already has locale cookies set
  const existingLocale = req.cookies.get(COOKIE_NAMES.locale)?.value;
  if (existingLocale) {
    const locale = getLocaleByCountryCode(existingLocale.split("-")[1] ?? "");
    if (locale) {
      return NextResponse.json(localeToPreferences(locale));
    }
  }

  // Try to detect country from IP using free ipapi.co API
  let detectedCountryCode = "";

  try {
    // Get IP from headers (Vercel/CF provide these)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "";

    if (ip && ip !== "::1" && ip !== "127.0.0.1") {
      const res = await fetch(`https://ipapi.co/${ip}/json/`, {
        headers: { "Accept": "application/json" },
        next: { revalidate: 0 },
      });
      if (res.ok) {
        const data = await res.json();
        detectedCountryCode = data.country_code ?? "";
      }
    }
  } catch {
    // Geolocation failed — fall back to default
  }

  const locale = detectedCountryCode
    ? getLocaleByCountryCode(detectedCountryCode) ?? DEFAULT_LOCALE
    : DEFAULT_LOCALE;

  return NextResponse.json(localeToPreferences(locale));
}
