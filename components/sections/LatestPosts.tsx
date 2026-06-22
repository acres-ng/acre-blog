import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { PostCardCompact } from "@/components/blog/PostCardCompact";
import type { Article } from "@/types/strapi";

interface LatestPostsProps {
  articles: Article[];
}

export function LatestPosts({ articles }: LatestPostsProps) {
  if (!articles.length) return null;

  const [featured, ...rest] = articles;
  const sideArticles = rest.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-acre-text mb-8">
        Latest posts
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-8 lg:gap-12">
        {/* Featured */}
        <FeaturedPost article={featured} />

        {/* Sidebar */}
        {sideArticles.length > 0 && (
          <div className="flex flex-col gap-4 divide-y divide-gray-100">
            {sideArticles.map((article) => (
              <div key={article.documentId} className="pt-4 first:pt-0">
                <PostCardCompact article={article} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
