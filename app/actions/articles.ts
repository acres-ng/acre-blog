"use server";

import { getArticles } from "@/app/lib/strapi/articles";

export async function loadMoreArticles(page: number, category?: string) {
  return getArticles({ page, pageSize: 6, category });
}
