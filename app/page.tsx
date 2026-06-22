import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { BrowseSection } from "@/components/sections/BrowseSection";
import { NewsletterCTA } from "@/components/sections/NewsletterCTA";
import { getLatestArticles } from "@/app/lib/strapi/articles";

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // Static data — cached, renders immediately without blocking
  const latestArticles = await getLatestArticles(5);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <LatestPosts articles={latestArticles} />

        {/* BrowseSection awaits searchParams — must be inside Suspense */}
        <Suspense fallback={<BrowseSectionSkeleton />}>
          <BrowseSection searchParams={searchParams} />
        </Suspense>

        <NewsletterCTA />
      </main>
      <Footer />
    </>
  );
}

function BrowseSectionSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="h-9 w-56 bg-gray-100 rounded-lg mb-6 animate-pulse" />
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-24 bg-gray-100 rounded-full animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl aspect-[4/3] animate-pulse" />
        ))}
      </div>
    </section>
  );
}
