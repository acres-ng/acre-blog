import { Suspense } from "react";
import { CategoryFilter } from "@/components/sections/CategoryFilter";
import { PostGrid } from "@/components/sections/PostGrid";
import { getArticles } from "@/app/lib/strapi/articles";
import { getCategories } from "@/app/lib/strapi/categories";

interface BrowseSectionProps {
  searchParams: Promise<{ category?: string }>;
}

export async function BrowseSection({ searchParams }: BrowseSectionProps) {
  const { category } = await searchParams;

  const [articlesData, categories] = await Promise.all([
    getArticles({ page: 1, pageSize: 6, category }),
    getCategories(),
  ]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-acre-text mb-6">
        Browse by categories
      </h2>
      <div className="mb-8">
        {/* CategoryFilter uses useSearchParams() — needs its own Suspense */}
        <Suspense fallback={<div className="h-10" />}>
          <CategoryFilter categories={categories} />
        </Suspense>
      </div>
      <PostGrid
        key={category ?? "all"}
        initialArticles={articlesData.data}
        totalPages={articlesData.meta.pagination.pageCount}
        category={category}
      />
    </section>
  );
}
