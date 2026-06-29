import { ENV } from "@/lib/env";

const STRAPI_URL = ENV.STRAPI_URL;
const STRAPI_TOKEN = ENV.STRAPI_API_TOKEN;
const DEBUG = ENV.LOG_LEVEL === "DEBUG";

if (!STRAPI_URL) throw new Error("NEXT_PUBLIC_STRAPI_URL is not set");


export async function strapiGet<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    ...((options?.headers as Record<string, string>) ?? {}),
  };

  const url = `${STRAPI_URL}/api${path}`;

  if (DEBUG) console.debug(`[strapi] GET ${url}`);

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    if (DEBUG) console.debug(`[strapi] ${res.status} ${res.statusText}`);
    throw new Error(
      `Strapi API error: ${res.status} ${res.statusText} — ${path}`,
    );
  }

  const json = await res.json();
  if (DEBUG) console.debug(`[strapi] ${res.status} ${path}`, JSON.stringify(json, null, 2));

  return json as T;
}
