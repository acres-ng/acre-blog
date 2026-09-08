import { cacheLife, cacheTag } from "next/cache";
import type { Article, StrapiResponse } from "@/types/strapi";
import { strapiGet } from "./client";

/**
 * Builds Strapi `filters[$and][i][$or][j]` groups: every group must match,
 * and within a group any one field may match.
 */
function buildFilters(groups: string[][]): string {
  return groups
    .filter((ors) => ors.length > 0)
    .map((ors, gi) =>
      ors
        .map((clause, oi) => `filters[$and][${gi}][$or][${oi}]${clause}`)
        .join("&"),
    )
    .join("&");
}

function articleFilters({ category, q }: { category?: string; q?: string }) {
  const groups: string[][] = [];

  const query = q?.trim();
  if (query) {
    const v = encodeURIComponent(query);
    groups.push([`[title][$containsi]=${v}`, `[description][$containsi]=${v}`]);
  }

  const cat = category?.trim();
  if (cat) {
    const v = encodeURIComponent(cat);
    groups.push([
      `[category][slug][$eq]=${v}`,
      `[category][documentId][$eq]=${v}`,
    ]);
  }

  const filters = buildFilters(groups);
  return filters ? `&${filters}` : "";
}

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
  q,
}: {
  page?: number;
  pageSize?: number;
  category?: string;
  q?: string;
}): Promise<StrapiResponse<Article[]>> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");
  if (category) cacheTag(`category-${category}`);

  return strapiGet<StrapiResponse<Article[]>>(
    `/articles?populate=*&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}${articleFilters(
      { category, q },
    )}`,
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

const ARTICLE_POPULATE = "populate=*";

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`article-${slug}`);

  const data = await strapiGet<StrapiResponse<Article[]>>(
    `/articles?${ARTICLE_POPULATE}&filters[slug][$eq]=${encodeURIComponent(slug)}`,
  );
  return data.data[0] ?? null;
}

export async function getArticleDraftBySlug(
  slug: string,
): Promise<Article | null> {
  const data = await strapiGet<StrapiResponse<Article[]>>(
    `/articles?${ARTICLE_POPULATE}&filters[slug][$eq]=${encodeURIComponent(slug)}&status=draft`,
    { cache: "no-store" },
  );
  return data.data[0] ?? null;
}

export async function getRelatedArticles(
  category: string,
  excludeSlug: string,
  limit = 3,
): Promise<Article[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");
  cacheTag(`category-${category}`);

  const data = await strapiGet<StrapiResponse<Article[]>>(
    `/articles?populate=*&filters[slug][$ne]=${encodeURIComponent(
      excludeSlug,
    )}&sort=publishedAt:desc&pagination[pageSize]=${limit}${articleFilters({
      category,
    })}`,
  );
  return data.data;
}
