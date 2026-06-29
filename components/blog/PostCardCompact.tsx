import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/strapi";
import { ENV } from "@/lib/env";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCardCompact({ article }: { article: Article }) {
  const coverUrl = ENV.STRAPI_URL + article.cover.url;

  return (
    <article className="flex gap-3 group">
      <Link href={`/blog/${article.slug}`} className="flex-shrink-0">
        <div className="relative w-24 h-20 sm:w-28 sm:h-24 rounded-lg overflow-hidden">
          <Image
            src={coverUrl}
            alt={article.cover.alternativeText ?? article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="112px"
          />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-acre-muted mb-1">
          <span>{formatDate(article.publishedAt)}</span>
          {article.author?.name && (
            <>
              <span>·</span>
              <span>{article.author.name}</span>
            </>
          )}
        </div>
        <Link href={`/blog/${article.slug}`}>
          <h3 className="text-sm font-semibold text-acre-text line-clamp-2 hover:text-acre-green transition-colors leading-snug mb-2">
            {article.title}
          </h3>
        </Link>
        {article.category && (
          <span className="inline-block bg-acre-green-tag-bg text-acre-green text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
            {article.category.name}
          </span>
        )}
      </div>
    </article>
  );
}
