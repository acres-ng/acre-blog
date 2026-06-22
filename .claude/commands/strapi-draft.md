# Set Up Strapi Draft Mode (Content Preview)

Enable Next.js Draft Mode so editors can preview unpublished Strapi content without a rebuild.

## How it works

1. Strapi calls a Next.js route with a secret token
2. That route enables Draft Mode (sets a cookie)
3. Subsequent page renders detect the cookie and fetch draft content from Strapi
4. A disable route clears the cookie

---

## Rules (READ FIRST)

- `draftMode()` from `next/headers` is async in Next.js 16 — always `await` it
- Draft mode bypasses `'use cache'` — do NOT cache draft fetches
- Strapi draft content requires `publicationState=preview` query param on the REST API
- Never expose the draft secret in client components or public env vars

---

## Step 1: Create the enable route

Create `app/api/draft/route.ts`:

```ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  const type = searchParams.get('type') ?? 'article'

  if (secret !== process.env.STRAPI_DRAFT_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  if (!slug) {
    return new Response('Missing slug', { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()

  // Redirect to the appropriate preview path
  const previewPaths: Record<string, string> = {
    article: `/blog/${slug}`,
    // add more content types here
  }

  redirect(previewPaths[type] ?? `/${slug}`)
}
```

## Step 2: Create the disable route

Create `app/api/draft/disable/route.ts`:

```ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}
```

## Step 3: Update pages to serve draft content

In each page that should support preview, check draft mode and fetch accordingly:

```ts
import { draftMode } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

async function getArticle(slug: string) {
  const { isEnabled } = await draftMode()

  if (isEnabled) {
    // Draft fetch: no cache, include unpublished
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=cover&publicationState=preview`,
      {
        headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
        cache: 'no-store',
      },
    )
    const { data } = await res.json()
    return data[0] ?? null
  }

  // Production fetch: cached
  'use cache'
  cacheLife('hours')
  cacheTag(`article-${slug}`, 'articles')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=cover`,
    {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
    },
  )
  const { data } = await res.json()
  return data[0] ?? null
}
```

> **Note:** The `'use cache'` directive inside an `if` branch is valid — it only applies when that branch executes.

## Step 4: Add a Draft Mode banner (optional)

Show editors they're in preview mode:

```tsx
// app/components/draft-banner.tsx
import { draftMode } from 'next/headers'
import Link from 'next/link'

export async function DraftBanner() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null

  return (
    <div style={{ background: 'yellow', padding: '8px', textAlign: 'center' }}>
      Draft Mode active —{' '}
      <Link href="/api/draft/disable">Exit preview</Link>
    </div>
  )
}
```

Add `<DraftBanner />` to `app/layout.tsx`.

## Step 5: Add env var

```env
STRAPI_DRAFT_SECRET=choose-a-long-random-secret
```

## Step 6: Configure Strapi preview URL

In Strapi admin, for each content type:
1. Content-Types Builder → [your type] → Edit → Preview URL
2. Set to: `https://your-domain.com/api/draft?secret={STRAPI_DRAFT_SECRET}&slug={slug}&type=article`

Or configure in `config/plugins.ts` on the Strapi side for programmatic setup.
