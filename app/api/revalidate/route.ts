import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Map Strapi model (singular content-type UID) names to cache tags used in this app.
const MODEL_TAG_MAP: Record<string, string[]> = {
  article: ["articles"],
  category: ["categories"],
};

export async function POST(request: NextRequest) {
  const secret = request.headers.get("Authorization");
  if (secret !== `Bearer ${process.env.STRAPI_REVALIDATE_SECRET}`) {
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

  const { model, entry } = body;

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
