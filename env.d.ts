import type { R2Bucket } from "@cloudflare/workers-types";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SITE_URL: string;
      NEXT_PUBLIC_SITE_NAME: string;
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: string;
      NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY: string;
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
      NEXT_PUBLIC_STRIPE_KEY: string;
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: string;
      NEXT_PUBLIC_SANITY_PROJECT_ID: string;
      NEXT_PUBLIC_SANITY_DATASET: string;
      RESEND_API_KEY: string;
      RESEND_FROM_EMAIL: string;
      CLOUDFLARE_ACCOUNT_ID: string;
      R2_ACCESS_KEY_ID: string;
      R2_SECRET_ACCESS_KEY: string;
      R2_BUCKET_NAME: string;
      R2_PUBLIC_URL: string;
      R2_WORKER_URL: string;
      SANITY_API_TOKEN: string;
      SANITY_WEBHOOK_SECRET: string;
      STRIPE_WEBHOOK_SECRET: string;
      ADMIN_PANEL_PASSWORD?: string;
    }
  }
}

export {};
