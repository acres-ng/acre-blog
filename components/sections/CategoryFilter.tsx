"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { categoryParam } from "@/lib/category";
import type { Category } from "@/types/strapi";

interface CategoryFilterProps {
  categories: Category[];
}

const SEARCH_DEBOUNCE_MS = 350;

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const active = searchParams.get("category") ?? "all";
  const urlQuery = searchParams.get("q") ?? "";

  const [showSearch, setShowSearch] = useState(Boolean(urlQuery));
  const [searchQuery, setSearchQuery] = useState(urlQuery);

  const pushParams = (
    mutate: (params: URLSearchParams) => void,
    { replace = false } = {},
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    startTransition(() => {
      if (replace) router.replace(href, { scroll: false });
      else router.push(href, { scroll: false });
    });
  };

  // Debounce typing into the `q` search param.
  useEffect(() => {
    const value = searchQuery.trim();
    if (value === urlQuery) return;

    const timer = setTimeout(() => {
      pushParams(
        (params) => {
          if (value) params.set("q", value);
          else params.delete("q");
        },
        { replace: true },
      );
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, urlQuery]);

  // --- horizontal scroll affordances for the pill strip ---
  const stripRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const updateEdges = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ left: el.scrollLeft > 1, right: el.scrollLeft < max - 1 });
  }, []);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });

    // Pills change width with the font load and the viewport.
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);

    return () => {
      el.removeEventListener("scroll", updateEdges);
      observer.disconnect();
    };
  }, [updateEdges, categories.length]);

  // A deep-linked category can sit off-screen — bring it into view once.
  // Runs on the first render where the active pill actually exists: `active`
  // is still "all" until useSearchParams() resolves after hydration.
  const didCenterActive = useRef(false);
  useEffect(() => {
    if (didCenterActive.current || active === "all") return;
    const el = stripRef.current;
    const target = el?.querySelector<HTMLElement>('[data-active="true"]');
    if (!el || !target) return;

    didCenterActive.current = true;
    // Set scrollLeft directly — scrollIntoView would also scroll the page — and
    // suspend `scroll-smooth` so the strip starts in place instead of animating.
    const previousBehavior = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";
    el.scrollLeft = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2;
    el.style.scrollBehavior = previousBehavior;
    updateEdges();
  }, [active, categories.length, updateEdges]);

  const scrollByPage = (direction: -1 | 1) => {
    const el = stripRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  // Fade the clipped edge so it reads as "more to scroll", not "cut off".
  const fadeStyle = (() => {
    if (!edges.left && !edges.right) return undefined;
    const stops = [
      edges.left ? "transparent 0px" : "#000 0px",
      ...(edges.left ? ["#000 24px"] : []),
      ...(edges.right ? ["#000 calc(100% - 24px)"] : []),
      edges.right ? "transparent 100%" : "#000 100%",
    ];
    const gradient = `linear-gradient(to right, ${stops.join(", ")})`;
    return { maskImage: gradient, WebkitMaskImage: gradient };
  })();

  const arrowClass =
    "hidden md:flex flex-shrink-0 items-center justify-center h-9 w-9 rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-acre-green hover:text-acre-green disabled:opacity-0 disabled:pointer-events-none";

  const handleCategoryClick = (value: string | null) => {
    pushParams((params) => {
      if (value) params.set("category", value);
      else params.delete("category");
    });
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
  };

  const tabClass = (isActive: boolean) =>
    `flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[40px] ${
      isActive
        ? "bg-acre-green text-white"
        : "border border-gray-300 text-gray-600 hover:border-acre-green hover:text-acre-green"
    }`;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        onClick={() => scrollByPage(-1)}
        className={arrowClass}
        disabled={!edges.left}
        aria-label="Scroll categories left"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scrollable tab strip */}
      <div
        ref={stripRef}
        style={fadeStyle}
        className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 scrollbar-hide"
      >
        <button
          onClick={() => handleCategoryClick(null)}
          data-active={active === "all"}
          className={tabClass(active === "all")}
        >
          All Posts
        </button>
        {categories.map((cat) => {
          const value = categoryParam(cat);
          return (
            <button
              key={cat.documentId}
              onClick={() => handleCategoryClick(value)}
              data-active={active === value}
              className={tabClass(active === value)}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scrollByPage(1)}
        className={arrowClass}
        disabled={!edges.right}
        aria-label="Scroll categories right"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

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
              aria-label="Search posts"
              onKeyDown={(e) => {
                if (e.key === "Escape") closeSearch();
              }}
            />
            <button
              onClick={closeSearch}
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
