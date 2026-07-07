import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const type = searchParams.get("type") ?? "article";

  if (secret !== process.env.STRAPI_DRAFT_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  const previewPaths: Record<string, string> = {
    article: `/blog/${slug}`,
  };

  redirect(previewPaths[type] ?? `/${slug}`);
}
