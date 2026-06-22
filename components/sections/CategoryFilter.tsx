"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/types/strapi";

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const active = searchParams.get("category") ?? "all";

  const handleCategoryClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Scrollable tab strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 scrollbar-hide">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[40px] ${
            active === "all"
              ? "bg-acre-green text-white"
              : "border border-gray-300 text-gray-600 hover:border-acre-green hover:text-acre-green"
          }`}
        >
          All Posts
        </button>
        {categories.map((cat) => (
          <button
            key={cat.documentId}
            onClick={() => handleCategoryClick(cat.slug)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[40px] ${
              active === cat.slug
                ? "bg-acre-green text-white"
                : "border border-gray-300 text-gray-600 hover:border-acre-green hover:text-acre-green"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search toggle */}
      <div className="flex-shrink-0">
        {showSearch ? (
          <div className="flex items-center gap-2 border border-acre-green rounded-full px-3 py-1.5 bg-white">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts…"
              className="text-sm outline-none w-28 sm:w-44 bg-transparent"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowSearch(false);
                  setSearchQuery("");
                }
              }}
            />
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close search"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="p-2.5 rounded-full bg-acre-green text-white hover:bg-acre-green-hover transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Search posts"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
