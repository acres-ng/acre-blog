import type { Category } from "@/types/strapi";

/**
 * URL value used to identify a category. Categories can be published without a
 * slug, so fall back to the documentId — the API filter matches either.
 */
export function categoryParam(
  category: Pick<Category, "slug" | "documentId">,
): string {
  return category.slug?.trim() || category.documentId;
}
