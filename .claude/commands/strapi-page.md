# Generate a Strapi-backed Page

Generate a new Next.js 16 App Router page that fetches content from Strapi using the correct caching model for this project.

## Input: $ARGUMENTS

Format: `<route-path> <strapi-content-type> [--list|--detail]`

Examples:
- `app/blog/page.tsx articles --list`
- `app/blog/[slug]/page.tsx articles --detail`

---

## Rules (READ FIRST)

This project uses **Next.js 16 with Cache Components**. The old caching model (`fetch` options, `revalidate` exports, `getStaticProps`) is replaced. Follow these rules strictly:

### Caching
- Use `'use cache'` directive inside async functions/components that fetch from Strapi
- Import and call `cacheLife` from `next/cache` to set TTL — never use `export const revalidate`
- Import and call `cacheTag` from `next/cache` to tag data for on-demand invalidation
- Do NOT pass `{ next: { revalidate } }` or `{ cache: 'force-cache' }` to `fetch`
- `cacheComponents: true` must be set in `next.config.ts` — check before generating

### Data Fetching
- Fetch in Server Components (async functions, no `'use client'`)
- Use `NEXT_PUBLIC_STRAPI_URL` env var for base URL
- Always include `Authorization: Bearer ${process.env.STRAPI_API_TOKEN}` for non-public endpoints
- Always `populate=*` or explicitly name relations — Strapi omits them by default
- Type the Strapi response: wrap in an interface matching the content type shape

### Instant Navigation
- Export `unstable_instant` from every page that should navigate instantly
- Wrap uncached (fresh) data in `<Suspense>` with a fallback
- Cached data does NOT need Suspense

### Images
- Use `next/image` — never raw `<img>` for Strapi media
- Strapi image URL = `process.env.NEXT_PUBLIC_STRAPI_URL + field.url`

---

## Step 1: Read next.config.ts

Check if `cacheComponents: true` is set. If not, add it before generating any page code.

## Step 2: Determine page type

**--list**: Fetches a collection, renders cards/list. Cache at data level.
**--detail**: Fetches single item by slug/id via `generateStaticParams`. Cache at data level with per-item tags.

## Step 3: Generate the page

### List page template

```tsx
import { cacheLife, cacheTag } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'

export const unstable_instant = { prefetch: 'static' }

interface StrapiItem {
  id: number
  documentId: string
  // add fields from the content type
  title: string
  slug: string
  publishedAt: string
  cover?: { url: string; alternativeText?: string }
}

interface StrapiResponse<T> {
  data: T[]
  meta: { pagination: { page: number; pageSize: number; total: number } }
}

async function getItems(): Promise<StrapiResponse<StrapiItem>> {
  'use cache'
  cacheLife('hours')
  cacheTag('articles') // use content type name

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?populate=cover&sort=publishedAt:desc`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    },
  )

  if (!res.ok) throw new Error(`Strapi fetch failed: ${res.status}`)
  return res.json()
}

export default async function Page() {
  const { data: items } = await getItems()

  return (
    <main>
      <h1>Articles</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`/blog/${item.slug}`}>
              {item.cover && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item.cover.url}`}
                  alt={item.cover.alternativeText ?? item.title}
                  width={400}
                  height={225}
                />
              )}
              <h2>{item.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

### Detail page template

```tsx
import { cacheLife, cacheTag } from 'next/cache'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const unstable_instant = { prefetch: 'static' }

interface Article {
  id: number
  documentId: string
  title: string
  slug: string
  content: string
  publishedAt: string
  cover?: { url: string; alternativeText?: string }
}

async function getArticleBySlug(slug: string): Promise<Article | null> {
  'use cache'
  cacheLife('hours')
  cacheTag(`article-${slug}`, 'articles')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=cover`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    },
  )

  if (!res.ok) throw new Error(`Strapi fetch failed: ${res.status}`)
  const { data } = await res.json()
  return data[0] ?? null
}

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?fields[0]=slug`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    },
  )
  const { data } = await res.json()
  return data.map((item: { slug: string }) => ({ slug: item.slug }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) notFound()

  return (
    <article>
      {article.cover && (
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${article.cover.url}`}
          alt={article.cover.alternativeText ?? article.title}
          width={1200}
          height={630}
          priority
        />
      )}
      <h1>{article.title}</h1>
      <p>{new Date(article.publishedAt).toLocaleDateString()}</p>
      <div>{article.content}</div>
    </article>
  )
}
```

## Step 4: Check env vars

Ensure `.env.local` has:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
```

Remind the user to add `STRAPI_API_TOKEN` to their Strapi admin under Settings → API Tokens.

## Step 5: Check next.config.ts image patterns

Ensure `remotePatterns` includes the Strapi host. For local dev:
```ts
remotePatterns: [
  {
    protocol: 'http',
    hostname: 'localhost',
    port: '1337',
    pathname: '/**',
  },
],
```
