import { ENV } from "@/lib/env";

const DEBUG = ENV.LOG_LEVEL === "DEBUG";

export async function acreGet<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  if (!ENV.ACRE_API_URL) {
    throw new Error("NEXT_PUBLIC_ACRE_API_URL is not set");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) ?? {}),
  };

  const url = `${ENV.ACRE_API_URL}${path}`;

  if (DEBUG) console.debug(`[acre] GET ${url}`);

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    if (DEBUG) console.debug(`[acre] ${res.status} ${res.statusText}`);
    throw new Error(`Acre API error: ${res.status} ${res.statusText} — ${path}`);
  }

  const json = await res.json();
  if (DEBUG) console.debug(`[acre] ${res.status} ${path}`, JSON.stringify(json, null, 2));

  return json as T;
}
