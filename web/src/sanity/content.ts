import { defineQuery } from "next-sanity";
import { cacheLife } from "next/cache";
import { client } from "./client";

// Each document is a singleton whose ID is its type's name. A page is kept for
// about a minute, then fetched again behind the next visit.

const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]`);
const HOME_QUERY = defineQuery(`*[_type == "homePage" && _id == "homePage"][0]`);
const PRIVACY_QUERY = defineQuery(`*[_type == "privacyPage" && _id == "privacyPage"][0]`);

function published<T>(document: T | null, id: string): T {
  if (!document) throw new Error(`the document "${id}" is not published in Sanity`);
  return document;
}

export async function getSettings() {
  "use cache";
  cacheLife("minutes");
  return published(await client.fetch(SETTINGS_QUERY), "siteSettings");
}

export async function getHome() {
  "use cache";
  cacheLife("minutes");
  return published(await client.fetch(HOME_QUERY), "homePage");
}

export async function getPrivacy() {
  "use cache";
  cacheLife("minutes");
  return published(await client.fetch(PRIVACY_QUERY), "privacyPage");
}

export type Home = Awaited<ReturnType<typeof getHome>>;
