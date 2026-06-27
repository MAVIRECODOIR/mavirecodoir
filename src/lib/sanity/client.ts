import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export const sanityFetch = {
  async run<T = any>(query: string, params?: Record<string, unknown>, tags: string[] = []) {
    return client.fetch<T>(query, params ?? {}, { next: { tags } });
  },
};

export const TAGS = {
  post: "sanity-post",
  category: "sanity-category",
  journal: "sanity-journal",
} as const;
