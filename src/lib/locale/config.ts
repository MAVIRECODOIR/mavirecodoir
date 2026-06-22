import type { Locale, LocalePreferences } from "./types";

export const LOCALES: Locale[] = [
  { code: "en-GB", language: "English", country: "United Kingdom", countryCode: "GB", currency: "GBP" },
  { code: "en-US", language: "English", country: "United States", countryCode: "US", currency: "USD" },
  { code: "en-CA", language: "English", country: "Canada", countryCode: "CA", currency: "CAD" },
  { code: "en-AU", language: "English", country: "Australia", countryCode: "AU", currency: "AUD" },
  { code: "en-JP", language: "English", country: "Japan", countryCode: "JP", currency: "JPY" },
  { code: "fr-FR", language: "Français", country: "France", countryCode: "FR", currency: "EUR" },
  { code: "de-DE", language: "Deutsch", country: "Germany", countryCode: "DE", currency: "EUR" },
  { code: "it-IT", language: "Italiano", country: "Italy", countryCode: "IT", currency: "EUR" },
  { code: "es-ES", language: "Español", country: "Spain", countryCode: "ES", currency: "EUR" },
  { code: "pt-BR", language: "Português", country: "Brazil", countryCode: "BR", currency: "BRL" },
  { code: "zh-CN", language: "中文", country: "China", countryCode: "CN", currency: "CNY" },
  { code: "ko-KR", language: "한국어", country: "South Korea", countryCode: "KR", currency: "KRW" },
  { code: "ja-JP", language: "日本語", country: "Japan", countryCode: "JP", currency: "JPY" },
  { code: "ar-SA", language: "العربية", country: "Saudi Arabia", countryCode: "SA", currency: "SAR" },
  { code: "en-GH", language: "English", country: "Ghana", countryCode: "GH", currency: "GHS" },
];

export const DEFAULT_LOCALE: Locale = LOCALES[0]; // en-GB

export const COOKIE_NAMES = {
  locale: "mavire-locale",
  country: "mavire-country",
  language: "mavire-language",
  currency: "mavire-currency",
} as const;

export function getLocaleByCode(code: string): Locale | undefined {
  return LOCALES.find((l) => l.code === code);
}

export function getLocaleByCountryCode(countryCode: string): Locale | undefined {
  // Prefer exact match, fall back to any locale with that country
  return LOCALES.find((l) => l.countryCode === countryCode && l.language === "English")
    ?? LOCALES.find((l) => l.countryCode === countryCode);
}

export function localeToPreferences(locale: Locale): LocalePreferences {
  return {
    locale: locale.code,
    country: locale.country,
    language: locale.language,
    currency: locale.currency,
  };
}
