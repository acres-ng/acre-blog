import { cacheLife, cacheTag } from "next/cache";
import type { Article, StrapiResponse } from "@/types/strapi";
import { strapiGet } from "./client";

export async function getLatestArticles(limit = 5): Promise<Article[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");

  const data = await strapiGet<StrapiResponse<Article[]>>(
    `/articles?populate=*&sort=publishedAt:desc&pagination[pageSize]=${limit}`,
  );
  return data.data;
}

export async function getArticles({
  page = 1,
  pageSize = 6,
  category,
}: {
  page?: number;
  pageSize?: number;
  category?: string;
}): Promise<StrapiResponse<Article[]>> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");
  if (category) cacheTag(`category-${category}`);

  const categoryFilter = category
    ? `&filters[category][slug][$eq]=${category}`
    : "";

  return strapiGet<StrapiResponse<Article[]>>(
    `/articles?populate=*&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}${categoryFilter}`,
  );
}

export async function getAllArticleSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");

  const data = await strapiGet<StrapiResponse<Pick<Article, "slug">[]>>(
    `/articles?fields=slug&pagination[pageSize]=100`,
  );
  return data.data.map((a) => a.slug);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`article-${slug}`);

  const data = await strapiGet<StrapiResponse<Article[]>>(
    `/articles?populate=*&filters[slug][$eq]=${slug}`,
  );
  return data.data[0] ?? null;
}

export async function getRelatedArticles(
  categorySlug: string,
  excludeSlug: string,
  limit = 3,
): Promise<Article[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");
  cacheTag(`category-${categorySlug}`);

  const data = await strapiGet<StrapiResponse<Article[]>>(
    `/articles?populate=*&filters[category][slug][$eq]=${categorySlug}&filters[slug][$ne]=${excludeSlug}&sort=publishedAt:desc&pagination[pageSize]=${limit}`,
  );
  return data.data;
}
