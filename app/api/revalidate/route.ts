import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/lib/env";
import { secretMatches } from "@/lib/secrets";

/*
 * Strapi model (singular content-type UID) -> cache tags to bust.
 *
 * The webhook that calls this route is created by acre-cms on boot
 * (src/index.ts, AC-1028) from BLOG_REVALIDATE_URL and the same
 * STRAPI_REVALIDATE_SECRET as here.
 *
 * Articles are fetched with their category and author populated, so a
 * category or author change has to bust "articles" too, which every article
 * fetch carries (including the single-article page). `${model}-${slug}` is
 * busted as well: article-<slug> and category-<slug>.
 */
const MODEL_TAG_MAP: Record<string, string[]> = {
  article: ["articles"],
  category: ["categories", "articles"],
  author: ["articles"],
};

export async function POST(request: NextRequest) {
  const header = request.headers.get("Authorization") ?? "";
  const secret = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!secretMatches(secret, ENV.STRAPI_REVALIDATE_SECRET)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: {
    event?: string;
    model?: string;
    entry?: { id?: number; slug?: string };
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const { event, model, entry } = body;

  // Strapi admin's "Trigger" test button sends { event: "trigger-test" }
  // with no model/entry — treat as a connectivity check, not an error.
  if (event === "trigger-test") {
    return NextResponse.json({ revalidated: false, test: true });
  }

  if (!model) {
    return NextResponse.json(
      { message: "Missing model in payload" },
      { status: 400 },
    );
  }

  const tags = MODEL_TAG_MAP[model] ?? [];

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  if (entry?.slug) {
    revalidateTag(`${model}-${entry.slug}`, { expire: 0 });
  }

  return NextResponse.json({
    revalidated: true,
    model,
    tags: [...tags, entry?.slug ? `${model}-${entry.slug}` : null].filter(
      Boolean,
    ),
  });
}
