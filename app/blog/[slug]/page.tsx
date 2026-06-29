import Image from "next/image";
import { ENV } from "@/lib/env";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RichTextRenderer } from "@/components/blog/RichTextRenderer";
import { ArticleSidebar } from "@/components/blog/ArticleSidebar";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getRelatedArticles,
} from "@/app/lib/strapi/articles";

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = article.category
    ? await getRelatedArticles(article.category.slug, slug)
    : [];

  const coverUrl = ENV.STRAPI_URL + article.cover.url;
  const articleUrl = `${ENV.STRAPI_URL}/blog/${slug}`;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Page header — centered, max-width constrained */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-acre-muted hover:text-acre-green transition-colors mb-8"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>

          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm text-acre-muted mb-4">
              <span>Published, {formatDate(article.publishedAt)}</span>
              {article.author?.name && (
                <>
                  <span>·</span>
                  <span>By, {article.author.name}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-acre-text leading-tight mb-5">
              {article.title}
            </h1>

            {/* Category tags */}
            {article.category && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="inline-block bg-acre-green-tag-bg text-acre-green text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                  {article.category.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Two-column body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

            {/* Left sidebar — stacks below content on mobile */}
            <div className="order-2 lg:order-1 lg:w-72 xl:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <ArticleSidebar articleUrl={articleUrl} title={article.title} />
              </div>
            </div>

            {/* Article content */}
            <article className="order-1 lg:order-2 flex-1 min-w-0">
              {/* Cover image */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
                <Image
                  src={coverUrl}
                  alt={article.cover.alternativeText ?? article.title}
                  fill
                  preload={true}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, calc(100vw - 360px)"
                />
              </div>

              {/* Description intro */}
              <p className="text-base sm:text-lg text-acre-muted leading-relaxed mb-6">
                {article.description}
              </p>

              {/* Rich text blocks */}
              {article.blocks && article.blocks.length > 0 && (
                <RichTextRenderer blocks={article.blocks} />
              )}
            </article>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && <RelatedPosts articles={related} />}
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} | Acre Blog`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: [
        {
          url: ENV.STRAPI_URL + article.cover.url,
          width: article.cover.width,
          height: article.cover.height,
          alt: article.cover.alternativeText ?? article.title,
        },
      ],
    },
  };
}
