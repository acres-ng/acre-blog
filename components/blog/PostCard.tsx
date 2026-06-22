import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/strapi";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({ article }: { article: Article }) {
  const coverUrl = process.env.NEXT_PUBLIC_STRAPI_URL + article.cover.url;

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <Link href={`/blog/${article.slug}`}>
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={coverUrl}
            alt={article.cover.alternativeText ?? article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-4">
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
          <h3 className="font-semibold text-acre-text leading-snug mb-2 line-clamp-2 hover:text-acre-green transition-colors">
            {article.title}
          </h3>
        </Link>
        <p className="text-sm text-acre-muted line-clamp-2 mb-3">
          {article.description}
        </p>
        {article.category && (
          <span className="inline-block bg-acre-green-tag-bg text-acre-green text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            {article.category.name}
          </span>
        )}
      </div>
    </article>
  );
}
