# Set Up Strapi Webhook Revalidation

Create a Next.js Route Handler that receives Strapi webhooks and invalidates cached content on-demand.

## Input: $ARGUMENTS

Optional: `<content-types>` — comma-separated Strapi content types to handle (e.g., `articles,authors`). Defaults to deriving from existing pages.

---

## Rules (READ FIRST)

This project uses **Next.js 16 with Cache Components**. On-demand revalidation uses `revalidateTag` from `next/cache` — not `res.revalidate()` or `revalidatePath` alone.

Strapi sends a `POST` request to a webhook URL when content is created, updated, published, unpublished, or deleted. The payload contains `event` and `model` (content type).

---

## Step 1: Scan existing pages for cacheTag calls

Search for all `cacheTag(` calls across `app/` to discover what tags are used. Map them by content type.

## Step 2: Create the Route Handler

Create `app/api/revalidate/route.ts`:

```ts
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Map Strapi model names to cache tags used in this app.
// Add entries as you add new content types.
const MODEL_TAG_MAP: Record<string, string[]> = {
  article: ['articles'],
  author: ['authors'],
  // 'model-name': ['tag1', 'tag2'],
}

export async function POST(request: NextRequest) {
  // Validate the secret token
  const secret = request.headers.get('Authorization')
  if (secret !== `Bearer ${process.env.STRAPI_REVALIDATE_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  let body: { event?: string; model?: string; entry?: { id?: number; slug?: string } }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  const { model, entry } = body

  if (!model) {
    return NextResponse.json({ message: 'Missing model in payload' }, { status: 400 })
  }

  const tags = MODEL_TAG_MAP[model] ?? []

  // Revalidate collection tag
  for (const tag of tags) {
    revalidateTag(tag)
  }

  // Revalidate per-item tag if slug is available
  if (entry?.slug) {
    revalidateTag(`${model}-${entry.slug}`)
  }

  return NextResponse.json({
    revalidated: true,
    model,
    tags: [...tags, entry?.slug ? `${model}-${entry.slug}` : null].filter(Boolean),
  })
}
```

## Step 3: Add env var

Add to `.env.local`:
```env
STRAPI_REVALIDATE_SECRET=choose-a-long-random-secret
```

## Step 4: Register webhook in Strapi

In Strapi admin:
1. Settings → Webhooks → Add new webhook
2. Name: `Next.js Revalidate`
3. URL: `https://your-domain.com/api/revalidate`  
   (for local dev: use ngrok or similar to expose localhost)
4. Headers: `Authorization: Bearer <your-STRAPI_REVALIDATE_SECRET>`
5. Events: check `entry.create`, `entry.update`, `entry.publish`, `entry.unpublish`, `entry.delete`
6. Save and test with the "Trigger" button

## Step 5: Verify cacheTag alignment

Confirm every `cacheTag()` call in the app has a matching entry in `MODEL_TAG_MAP`. Run:
```
grep -r "cacheTag(" app/
```
