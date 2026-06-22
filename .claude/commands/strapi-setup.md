# Strapi + Next.js 16 Project Setup Audit

Audit and configure this project for Strapi integration following Next.js 16 best practices.

---

## Rules for all Strapi work in this project

Read this before writing any Strapi-related code:

### Next.js 16 caching model (BREAKING from older versions)
- `fetch` requests are **NOT cached by default** — old behavior gone
- Use `'use cache'` directive + `cacheLife()` instead of `{ next: { revalidate: N } }`
- Use `cacheTag()` + `revalidateTag()` for on-demand invalidation
- `export const revalidate = N` at route level still works but prefer `cacheLife`
- `cacheComponents: true` in `next.config.ts` enables the new cache model

### Strapi API conventions
- Base URL: `process.env.NEXT_PUBLIC_STRAPI_URL` (public, for images too)
- Auth token: `process.env.STRAPI_API_TOKEN` (server-only, never `NEXT_PUBLIC_`)
- Relations and media are NOT included by default → always add `?populate=*` or specific populate params
- Filtering: `?filters[field][$eq]=value`
- Sorting: `?sort=field:desc`
- Pagination: `?pagination[page]=1&pagination[pageSize]=10`
- Draft content: `?publicationState=preview` (requires token with draft permission)
- Strapi v5 uses `documentId` (string UUID) alongside numeric `id`

### File structure for Strapi data layer
Keep fetch functions in `app/lib/strapi/` not inline in pages:
```
app/
  lib/
    strapi/
      client.ts       ← base fetch wrapper with auth header
      articles.ts     ← article-specific fetchers
      authors.ts      ← author-specific fetchers
  api/
    revalidate/
      route.ts        ← webhook handler
    draft/
      route.ts        ← draft mode enable
      disable/
        route.ts      ← draft mode disable
```

---

## Step 1: Audit next.config.ts

Read `next.config.ts`. Check for:

- [ ] `cacheComponents: true` — add if missing
- [ ] `images.remotePatterns` — must include Strapi host(s)
- [ ] No deprecated options (e.g. `experimental.appDir` — removed in v15+)

Required `next.config.ts` shape:
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
        hostname: process.env.STRAPI_HOSTNAME ?? 'localhost',
        port: process.env.NODE_ENV === 'production' ? '' : '1337',
        pathname: '/uploads/**',
      },
    ],
  },
}

export default nextConfig
```

## Step 2: Audit .env.local

Check that these vars exist (do NOT expose values):
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=
STRAPI_REVALIDATE_SECRET=
STRAPI_DRAFT_SECRET=
STRAPI_HOSTNAME=localhost
```

## Step 3: Create Strapi base client

Create `app/lib/strapi/client.ts`:
```ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

if (!STRAPI_URL) throw new Error('NEXT_PUBLIC_STRAPI_URL is not set')

export async function strapiGet<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    ...((options?.headers as Record<string, string>) ?? {}),
  }

  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText} — ${path}`)
  }

  return res.json() as Promise<T>
}
```

## Step 4: Scan existing pages

Read all files in `app/` that call `fetch`. For each:
- Does it use `'use cache'`? If not, determine if it should (static content) or use Suspense (dynamic)
- Does it have `Authorization` header? If accessing non-public Strapi data, it must
- Does it handle `res.ok === false`?

Report findings before making changes.

## Step 5: Check TypeScript types

Check `types/` directory. If no Strapi types exist, create `types/strapi.ts`:
```ts
export interface StrapiPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface StrapiMeta {
  pagination: StrapiPagination
}

export interface StrapiResponse<T> {
  data: T
  meta: StrapiMeta
}

export interface StrapiMedia {
  id: number
  documentId: string
  url: string
  alternativeText: string | null
  width: number
  height: number
  formats: {
    thumbnail?: StrapiMediaFormat
    small?: StrapiMediaFormat
    medium?: StrapiMediaFormat
    large?: StrapiMediaFormat
  }
}

export interface StrapiMediaFormat {
  url: string
  width: number
  height: number
}
```

## Step 6: Report

After audit, list:
1. Changes made
2. Missing env vars the user must fill in
3. Any pages that need updating with correct cache patterns
