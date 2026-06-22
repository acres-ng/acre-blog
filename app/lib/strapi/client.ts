const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

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

  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(
      `Strapi API error: ${res.status} ${res.statusText} — ${path}`,
    );
  }

  return res.json() as Promise<T>;
}
