import { PostCard } from "@/components/blog/PostCard";
import type { Article } from "@/types/strapi";

export function RelatedPosts({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-gray-100">
      <h2 className="text-2xl sm:text-3xl font-bold text-acre-text mb-8">
        Explore Related Posts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <PostCard key={article.documentId} article={article} />
        ))}
      </div>
    </section>
  );
}
