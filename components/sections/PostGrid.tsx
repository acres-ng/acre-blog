"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PostCard } from "@/components/blog/PostCard";
import { loadMoreArticles } from "@/app/actions/articles";
import type { Article } from "@/types/strapi";

interface PostGridProps {
  initialArticles: Article[];
  totalPages: number;
  category?: string;
}

export function PostGrid({
  initialArticles,
  totalPages,
  category,
}: PostGridProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalPages > 1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const result = await loadMoreArticles(nextPage, category);
      setArticles((prev) => [...prev, ...result.data]);
      setPage(nextPage);
      setHasMore(nextPage < result.meta.pagination.pageCount);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, category]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (!articles.length) {
    return (
      <p className="text-center text-acre-muted py-12">
        No posts found in this category.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <PostCard key={article.documentId} article={article} />
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center mt-10" aria-label="Loading more posts">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-acre-green animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Intersection sentinel */}
      {hasMore && !loading && (
        <div ref={sentinelRef} className="h-8 mt-4" aria-hidden="true" />
      )}

      {!hasMore && articles.length > 0 && (
        <p className="text-center text-sm text-acre-muted mt-10">
          You&apos;ve seen all posts
        </p>
      )}
    </div>
  );
}
