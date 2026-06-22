import { cacheLife, cacheTag } from "next/cache";
import type { Category, StrapiResponse } from "@/types/strapi";
import { strapiGet } from "./client";

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("days");
  cacheTag("categories");

  const data = await strapiGet<StrapiResponse<Category[]>>(
    "/categories?sort=name:asc",
  );
  return data.data;
}
