import Cookies from "js-cookie";
import type { LocalePreferences } from "./types";
import { COOKIE_NAMES, DEFAULT_LOCALE, getLocaleByCode, localeToPreferences } from "./config";

const COOKIE_OPTS = { expires: 365, sameSite: "lax" as const, path: "/" };

export function saveLocalePrefs(prefs: LocalePreferences): void {
  Cookies.set(COOKIE_NAMES.locale, prefs.locale, COOKIE_OPTS);
  Cookies.set(COOKIE_NAMES.country, prefs.country, COOKIE_OPTS);
  Cookies.set(COOKIE_NAMES.language, prefs.language, COOKIE_OPTS);
  Cookies.set(COOKIE_NAMES.currency, prefs.currency, COOKIE_OPTS);
}

export function readLocalePrefs(): LocalePreferences {
  const code = Cookies.get(COOKIE_NAMES.locale);
  if (code) {
    const locale = getLocaleByCode(code);
    if (locale) return localeToPreferences(locale);
  }
  return localeToPreferences(DEFAULT_LOCALE);
}

export function clearLocalePrefs(): void {
  Object.values(COOKIE_NAMES).forEach((name) => Cookies.remove(name, { path: "/" }));
}
