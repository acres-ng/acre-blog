import Image from "next/image";
import Link from "next/link";
import { CopyrightYear } from "@/components/ui/CopyrightYear";
import { getSiteLinks } from "@/app/lib/acre/app-settings";
import { SOCIAL_LABELS, SocialIcon, type SocialKey } from "./SocialIcon";

const SOCIAL_ORDER: SocialKey[] = [
  "whatsapp",
  "linkedin",
  "facebook",
  "twitter",
  "instagram",
  "youtube",
  "tiktok",
];

/**
 * Kept deliberately in step with the web app's footer
 * (acre-frontend/src/components/marketing/Footer.tsx): same columns in the same
 * order, same headings, same link and social styling, same copyright rule. The
 * two sit on the same domain in a reader's mind, and drifting apart reads as
 * two different companies.
 *
 * What differs is forced by the framework and the origin, not by taste: this
 * one is a server component reading app-settings at build/revalidate time
 * through getSiteLinks, where the web app fetches on the client through
 * useAppSettings; and every link but Blog points at the web app, because that
 * is where those pages live.
 */
const LINK_CLASS =
  "inline-block py-1 text-card-body text-acre-gray-border transition-colors duration-[200ms] hover:text-white";
const HEADING_CLASS = "text-card-title font-semibold text-white";

interface FooterLink {
  label: string;
  href: string;
  /** Same-origin links stay in the tab and use next/link. */
  internal?: boolean;
}

function renderLink(link: FooterLink) {
  if (link.internal) {
    return (
      <Link href={link.href} className={LINK_CLASS}>
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.href} className={LINK_CLASS}>
      {link.label}
    </a>
  );
}

function Column({
  heading,
  links,
  id,
}: {
  heading: string;
  links: FooterLink[];
  id?: string;
}) {
  return (
    <nav
      id={id}
      aria-label={heading}
      className={`flex flex-col gap-5${id ? " scroll-mt-24" : ""}`}
    >
      <h2 className={HEADING_CLASS}>{heading}</h2>
      <ul className="flex flex-col gap-4">
        {links.map((link) => (
          <li key={link.label}>{renderLink(link)}</li>
        ))}
      </ul>
    </nav>
  );
}

export async function Footer() {
  const links = await getSiteLinks();
  const website = links.websiteUrl;

  const socials = SOCIAL_ORDER.map((key) => ({
    key,
    href: links.social[key],
  })).filter((s): s is { key: SocialKey; href: string } => Boolean(s.href));

  const companyLinks: FooterLink[] = [
    { label: "Our Mission", href: `${website}/about` },
    // We are the blog, so this one stays home.
    { label: "Blog", href: "/", internal: true },
    { label: "Contact Us", href: `${website}/contact` },
  ];

  const downloadLinks: FooterLink[] = [
    links.app.playStore && {
      label: "Get on Android",
      href: links.app.playStore,
    },
    links.app.appStore && { label: "Get on iPhone", href: links.app.appStore },
    // Only when neither store link is configured, so the column is never empty.
    !links.app.playStore &&
      !links.app.appStore &&
      links.app.oneLink && { label: "Get the App", href: links.app.oneLink },
  ].filter((link): link is FooterLink => Boolean(link));

  const legalLinks: FooterLink[] = [
    links.legal.termsOfService && {
      label: "Terms & Conditions",
      href: links.legal.termsOfService,
    },
    links.legal.privacyPolicy && {
      label: "Privacy Policy",
      href: links.legal.privacyPolicy,
    },
    // /links is the privacy policy's third-party-links section, not a general
    // links page — so it sits under Legal rather than Company, as on the web
    // app. It is a page there, so this always points out.
    { label: "Link Tree", href: `${website}/links` },
  ].filter((link): link is FooterLink => Boolean(link));

  return (
    <footer className="bg-acre-green-dark pt-section">
      <div className="acre-container">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          <div className="flex flex-col gap-12">
            <a href={website} aria-label="Acre home" className="w-fit">
              <Image
                src="/Acre logo-white.svg"
                alt="Acre"
                width={140}
                height={44}
                className="h-11 w-auto"
              />
            </a>

            {links.companyAddress && (
              <address className="max-w-[22rem] whitespace-pre-line text-card-body not-italic leading-relaxed text-acre-gray-border">
                {links.companyAddress}
              </address>
            )}

            {socials.length > 0 && (
              <ul className="flex items-center gap-4">
                {socials.map(({ key, href }) => (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={SOCIAL_LABELS[key]}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-acre-green-dark transition-colors duration-[200ms] ease-acre-out hover:bg-acre-green-lighter"
                    >
                      <SocialIcon name={key} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Column heading="Company" links={companyLinks} />
          {/* The header's Download App button scrolls here, as on the web app. */}
          {downloadLinks.length > 0 && (
            <Column
              heading="Download App"
              links={downloadLinks}
              id="footer-download"
            />
          )}
          <Column heading="Legal" links={legalLinks} />
        </div>

        <div className="mt-14 flex items-center gap-1 border-t border-white/15 pb-10 pt-6">
          <Image
            src="/copyright.svg"
            alt=""
            aria-hidden="true"
            width={14}
            height={14}
          />
          <span className="text-micro font-light text-acre-gray-border">
            <CopyrightYear /> All Rights Reserved
          </span>
        </div>
      </div>
    </footer>
  );
}
