import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error("Set the Sanity project and dataset: copy .env.example to .env.local");
}

/**
 * Reads published content from the public dataset, on the server only: no
 * token, and a visitor's browser never talks to Sanity.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-11-26",
  useCdn: true,
  perspective: "published",
});
