type SiteConfig = {
  siteName: string;
  siteUrl: string;
};

export const siteConfig: SiteConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "MAVIRE CODOIR",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};
