export type Locale = {
  code: string;        // e.g. "en-GB"
  language: string;    // e.g. "English"
  country: string;     // e.g. "United Kingdom"
  countryCode: string; // e.g. "GB"
  currency: string;    // e.g. "GBP"
};

export type LocalePreferences = {
  locale: string;      // e.g. "en-GB"
  country: string;     // e.g. "United Kingdom"
  language: string;    // e.g. "English"
  currency: string;    // e.g. "GBP"
};
