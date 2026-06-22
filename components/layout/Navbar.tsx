"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" aria-label="acre — home">
            <Image
              src="/images/logo-with-tagline.png"
              alt="acre — Helping you grow"
              width={120}
              height={42}
              priority
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#"
              className="text-sm text-gray-600 hover:text-acre-green transition-colors"
            >
              Features
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-600 hover:text-acre-green transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-acre-green transition-colors"
            >
              Our Blog
            </Link>
            <Link
              href="#"
              className="bg-acre-green-dark text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-acre-green-hover transition-colors"
            >
              Download App
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-acre-green transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg
                className="h-6 w-6"
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
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          <Link
            href="#"
            className="block text-sm text-gray-600 py-3 hover:text-acre-green transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#"
            className="block text-sm text-gray-600 py-3 hover:text-acre-green transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/"
            className="block text-sm text-gray-600 py-3 hover:text-acre-green transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Our Blog
          </Link>
          <div className="pt-2">
            <Link
              href="#"
              className="block w-full text-center bg-acre-green-dark text-white text-sm font-medium px-5 py-3 rounded-full hover:bg-acre-green-hover transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Download App
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
