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

export function FeaturedPost({ article }: { article: Article }) {
  const coverUrl = ENV.STRAPI_URL + article.cover.url;

  return (
    <article className="group">
      <Link href={`/blog/${article.slug}`}>
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-xl overflow-hidden mb-4">
          <Image
            src={coverUrl}
            alt={article.cover.alternativeText ?? article.title}
            fill
            preload={true}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 700px"
          />
        </div>
      </Link>
      <div className="flex items-center gap-1.5 text-xs text-acre-muted mb-2">
        <span>{formatDate(article.publishedAt)}</span>
        {article.author?.name && (
          <>
            <span>·</span>
            <span>{article.author.name}</span>
          </>
        )}
      </div>
      <Link href={`/blog/${article.slug}`}>
        <h2 className="text-xl sm:text-2xl font-bold text-acre-text leading-snug mb-3 hover:text-acre-green transition-colors">
          {article.title}
        </h2>
      </Link>
      <p className="text-sm text-acre-muted line-clamp-2 mb-3">
        {article.description}
      </p>
      {article.category && (
        <span className="inline-block bg-acre-green-tag-bg text-acre-green text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
          {article.category.name}
        </span>
      )}
    </article>
  );
}
