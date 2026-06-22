# Blog Component Best Practices

Rules and patterns for building components in this Next.js 16 + Strapi blog. Apply every time a new component or page is created or modified.

---

## 1. Responsiveness — REQUIRED on every component

Mobile-first. Every component must handle all four breakpoints:

| Prefix | Width  | Target             |
|--------|--------|--------------------|
| (base) | <640px | Mobile portrait    |
| `sm:`  | 640px+ | Mobile landscape / tablet |
| `lg:`  | 1024px+| Desktop            |
| `xl:`  | 1280px+| Wide desktop       |

**Checklist per component:**
- [ ] Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- [ ] Text scale: `text-2xl sm:text-3xl lg:text-4xl`
- [ ] Section padding: `px-4 sm:px-6 lg:px-8` / `py-12 sm:py-16`
- [ ] Touch targets: `min-h-[40px] min-w-[40px]` on interactive elements
- [ ] Overflow tabs: `overflow-x-auto scrollbar-hide`
- [ ] Decorative elements hidden on mobile: `hidden lg:block`
- [ ] Flex direction: `flex-col lg:flex-row`

---

## 2. Server vs Client component

Default to **Server Component** (no directive needed). Add `"use client"` only when:
- `useState` / `useEffect` / `useRef` are used
- `useRouter` / `useSearchParams` / `usePathname` are used
- Browser-only APIs (IntersectionObserver, etc.)
- Event handlers on interactive elements that need state

When a section is mostly static but has one interactive part, **split**:
```
SomeSection.tsx        ← Server (fetches data, renders layout)
  └─ SomeButton.tsx    ← Client (handles click state)
```

---

## 3. Data fetching & caching (Next.js 16)

```typescript
// In server components or lib/ files — never in client components
import { cacheLife, cacheTag } from "next/cache";

async function fetchSomeData() {
  "use cache";
  cacheLife("hours");      // stale 5min | revalidate 1hr | expire 1day
  cacheTag("articles");    // on-demand invalidation via revalidateTag()

  return strapiGet("/articles?populate=*");
}
```

Cache profiles to choose from:
- `"seconds"` — real-time (live scores, stock prices)
- `"minutes"` — frequently updated content
- `"hours"` — blog post lists, category pages ← **default for this project**
- `"days"` — individual article pages, static reference data
- `"weeks"` — rarely updated content

Never fetch inside client components. Pass data as props from server components.

---

## 4. Next.js 16 — async params & searchParams

```typescript
// ALWAYS await params and searchParams in page/layout files
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { category } = await searchParams;
}
```

---

## 5. Next.js 16 Image component

```tsx
// Above the fold (hero image, featured post cover): use preload
<Image preload={true} src={...} alt={...} fill sizes="..." />

// Below the fold: omit preload — browser decides
<Image src={...} alt={...} fill sizes="..." />

// ALWAYS provide sizes matching the rendered size at each breakpoint
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

// Strapi media: prefix URL with env var
const src = process.env.NEXT_PUBLIC_STRAPI_URL + article.cover.url;
```

`priority` prop is deprecated in Next.js 16 — use `preload={true}` instead.

---

## 6. Strapi patterns

```typescript
// Base URL (images + API host)
process.env.NEXT_PUBLIC_STRAPI_URL     // public — safe in client code

// Auth token — server-only
process.env.STRAPI_API_TOKEN           // NEVER NEXT_PUBLIC_

// Query conventions
/articles?populate=*                   // include all relations
&filters[category][slug][$eq]=feeding  // filter by category
&sort=publishedAt:desc                 // newest first
&pagination[page]=1&pagination[pageSize]=6  // pagination
```

All fetch logic lives in `app/lib/strapi/` — never inline in page files.

---

## 7. Server Actions

```typescript
// app/actions/something.ts
"use server";

export async function doSomething(prevState: State, formData: FormData): Promise<State> {
  // validate → call Strapi → revalidateTag() if mutation
}
```

Form state via `useActionState` (React 19):
```typescript
"use client";
import { useActionState } from "react";

const [state, action, pending] = useActionState(doSomething, initialState);
```

---

## 8. PostCard anatomy — every card must have

1. Image linked to `/blog/${article.slug}` with `fill` + correct `sizes`
2. Date formatted with `toLocaleDateString`
3. Author name (guard: `article.author?.name`)
4. Title linked to `/blog/${article.slug}` with `line-clamp-2`
5. Description with `line-clamp-2` or `line-clamp-3`
6. Category badge: `bg-acre-green-tag-bg text-acre-green rounded-full uppercase`

---

## 9. Brand token reference

| Token | Value | Used for |
|-------|-------|---------|
| `acre-green` | `#2d6a47` | Logo, active tabs, tags |
| `acre-green-dark` | `#1b3c2a` | Footer bg, CTA buttons |
| `acre-green-hover` | `#245438` | Hover states |
| `acre-green-tag-bg` | `#e8f5ee` | Tag/badge backgrounds |
| `acre-text` | `#1a1a1a` | Body text, headings |
| `acre-muted` | `#6b7280` | Secondary text, dates, meta |
| `acre-hero-bg` | `#f5f8f5` | Hero section background |
| `acre-newsletter-bg` | `#eef3ee` | Newsletter section background |

---

## 10. CategoryFilter + PostGrid — URL-based filtering

Category tabs update the URL (`?category=feeding`). The server re-renders with filtered data. `PostGrid` receives a `key={category}` prop to force remount on category change, resetting infinite scroll state.

```tsx
<PostGrid
  key={category ?? "all"}   // ← critical: resets state on category change
  initialArticles={data}
  totalPages={meta.pageCount}
  category={category}
/>
```
