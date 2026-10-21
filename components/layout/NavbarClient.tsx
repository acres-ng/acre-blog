"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Kept deliberately in step with the web app's header
 * (acre-frontend/src/components/marketing/LandingNavbar.tsx): same logo, same
 * four links in the same order, same Download App button, same shadow-on-scroll
 * and the same slide-in drawer at phone width. A reader moving between the two
 * properties should not notice a seam.
 *
 * What differs is forced by this being a separate origin, not by taste: the
 * three website links are absolute URLs rather than router links, and "Blog"
 * points at this site's own home instead of out.
 */
interface NavLink {
  label: string;
  href: string;
  /** Same-origin links stay in the tab and use next/link. */
  internal?: boolean;
}

interface NavbarClientProps {
  /** The web app's origin — where the logo and three of the four links go. */
  websiteUrl: string;
}

const LINK_CLASS =
  "inline-flex min-h-[44px] items-center text-sm text-acre-black-text transition-colors duration-[200ms] hover:text-acre-green-normal";
const DRAWER_LINK_CLASS =
  "inline-flex min-h-[44px] items-center text-acre-black-text transition-colors duration-[200ms] hover:text-acre-green-normal";
const DOWNLOAD_CLASS =
  "rounded-xl bg-acre-green-normal px-6 py-3 text-sm font-semibold text-white transition-colors duration-[200ms] ease-acre-out hover:bg-acre-green-dark";

const cn = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

export function NavbarClient({ websiteUrl }: NavbarClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // The website's two section links are bare hashes here because they always
  // land on the landing page from outside — the browser resolves #how and
  // #product itself once that page has rendered.
  const navLinks: NavLink[] = [
    { label: "How it works", href: `${websiteUrl}/#how` },
    { label: "The app", href: `${websiteUrl}/#product` },
    { label: "Blog", href: "/", internal: true },
    { label: "Contact", href: `${websiteUrl}/contact` },
  ];

  // Shadow only once the bar has actually stuck, as on the web app.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // A closed drawer is only translated off-screen, so its links would still
  // take keyboard focus. `inert` removes it from tab order and the a11y tree.
  useEffect(() => {
    if (drawerRef.current) drawerRef.current.inert = !isMenuOpen;
  }, [isMenuOpen]);

  // The drawer traps the page behind it; close it on Escape.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  // Mirrors the web app's Download App button, which stays on the page and
  // scrolls to the footer's download column rather than leaving for a store.
  const goToDownload = () => {
    document
      .getElementById("footer-download")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const renderNavLink = (link: NavLink, className: string) => {
    if (link.internal) {
      return (
        <Link
          key={link.label}
          href={link.href}
          onClick={() => setIsMenuOpen(false)}
          className={className}
        >
          {link.label}
        </Link>
      );
    }

    return (
      <a
        key={link.label}
        href={link.href}
        onClick={() => setIsMenuOpen(false)}
        className={className}
      >
        {link.label}
      </a>
    );
  };

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="absolute top-0 h-2 w-full"
      />

      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-white transition-shadow duration-[200ms] ease-acre-out",
          isStuck ? "shadow-[0_1px_0_0_rgba(0,0,0,0.08)]" : "shadow-none",
        )}
      >
        <nav
          aria-label="Main"
          className="acre-container flex items-center justify-between py-4"
        >
          <a href={websiteUrl} className="shrink-0" aria-label="Acre home">
            <Image
              src="/Acre logo.svg"
              alt="Acre"
              width={102}
              height={44}
              priority
              className="h-8 w-auto md:h-11"
            />
          </a>

          <div className="hidden items-center gap-6 md:flex lg:gap-7">
            {navLinks.map((link) => renderNavLink(link, LINK_CLASS))}
            <button
              type="button"
              onClick={goToDownload}
              data-testid="nav-download-button"
              className={DOWNLOAD_CLASS}
            >
              Download App
            </button>
          </div>

          <button
            type="button"
            className="-mr-3 inline-flex h-11 w-11 items-center justify-center md:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            data-testid="menu-toggle-button"
          >
            <Image
              src="/Menu icon.svg"
              alt=""
              aria-hidden="true"
              width={24}
              height={24}
            />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-acre-black/40 transition-opacity duration-[200ms] md:hidden",
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-3/4 max-w-xs bg-white px-3 pt-6 shadow-lg md:hidden",
          "transition-transform duration-[520ms] ease-acre",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center"
          aria-label="Close menu"
          data-testid="menu-close-button"
        >
          <Image
            src="/Close icon.svg"
            alt=""
            aria-hidden="true"
            width={24}
            height={24}
          />
        </button>
        <div className="flex flex-col items-start gap-6 p-8">
          {navLinks.map((link) => renderNavLink(link, DRAWER_LINK_CLASS))}
          <button
            type="button"
            data-testid="nav-download-button-mobile"
            onClick={() => {
              setIsMenuOpen(false);
              goToDownload();
            }}
            className="rounded-xl bg-acre-green-normal px-6 py-3 text-sm font-semibold text-white"
          >
            Download App
          </button>
        </div>
      </div>
    </>
  );
}
