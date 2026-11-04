import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { ENV } from "@/lib/env";
import { secretMatches } from "@/lib/secrets";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const status = searchParams.get("status");

  // The CMS builds this URL with the same secret (acre-cms config/admin.ts).
  if (!secretMatches(secret, ENV.STRAPI_PREVIEW_SECRET)) {
    return new Response("Invalid token", { status: 401 });
  }

  // A path on this site only: "//evil.example" or "/\evil.example" would
  // make the redirect below leave the blog.
  if (!slug || !slug.startsWith("/") || /^\/[\/\\]/.test(slug)) {
    return new Response("Missing or invalid slug", { status: 400 });
  }

  const draft = await draftMode();
  if (status === "draft") {
    draft.enable();
  } else {
    draft.disable();
  }

  redirect(slug);
}
