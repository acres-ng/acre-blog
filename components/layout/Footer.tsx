import Link from "next/link";
import Image from "next/image";
import { CopyrightYear } from "@/components/ui/CopyrightYear";
import { getSiteLinks } from "@/app/lib/acre/app-settings";
import {
  SOCIAL_LABELS,
  SocialIcon,
  type SocialKey,
} from "./SocialIcon";

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
 * (acre-frontend/src/components/modules/landingpage/Footer.tsx): same columns,
 * same headings, same link and social styling, same copyright rule. The two
 * sit on the same domain in a reader's mind, and drifting apart reads as two
 * different companies.
 *
 * What differs is forced by the framework, not by taste: this one is a server
 * component reading app-settings at build/revalidate time through getSiteLinks,
 * where the web app fetches on the client through useAppSettings.
 */
const LINK_CLASS =
  "inline-block py-1 text-card-body text-acre-gray-border transition-colors hover:text-white";
const HEADING_CLASS = "text-card-title font-semibold text-white";

export async function Footer() {
  const links = await getSiteLinks();

  const socials = SOCIAL_ORDER.map((key) => ({
    key,
    href: links.social[key],
  })).filter((s): s is { key: SocialKey; href: string } => Boolean(s.href));

  return (
    <footer className="bg-acre-green-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-section pb-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          {/* Brand + social */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="acre — home">
              <Image
                src="/images/logo-white.png"
                alt="acre — Helping you grow"
                width={120}
                height={42}
                className="h-9 w-auto"
              />
            </Link>
            {links.companyAddress && (
              <address className="mt-8 max-w-[22rem] whitespace-pre-line text-card-body not-italic leading-relaxed text-acre-gray-border">
                {links.companyAddress}
              </address>
            )}

            {socials.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 mt-8">
                {socials.map(({ key, href }) => (
                  <a
                    key={key}
                    href={href}
                    aria-label={SOCIAL_LABELS[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-acre-green-dark transition-colors hover:bg-acre-green-tag-bg"
                  >
                    <SocialIcon name={key} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Company */}
          <div>
            <h3 className={`${HEADING_CLASS} mb-5`}>
              Company
            </h3>
            <ul className="space-y-3">
              {links.websiteUrl && (
                <li>
                  <Link
                    href={links.websiteUrl}
                    className={LINK_CLASS}
                  >
                    Our Mission
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/"
                  className={LINK_CLASS}
                >
                  Blog
                </Link>
              </li>
              {links.supportEmail && (
                <li>
                  <Link
                    href={`mailto:${links.supportEmail}`}
                    className={LINK_CLASS}
                  >
                    Contact Us
                  </Link>
                </li>
              )}
              {links.supportPhone && (
                <li>
                  <Link
                    href={`tel:${links.supportPhone.replace(/\s+/g, "")}`}
                    className={LINK_CLASS}
                  >
                    {links.supportPhone}
                  </Link>
                </li>
              )}
              {/* The link tree — download links, the farmer community, and the
                  other places Acre lives. It is a page on the web app, so this
                  always points out. */}
              {links.websiteUrl && (
                <li>
                  <Link href={`${links.websiteUrl}/links`} className={LINK_CLASS}>
                    Link Tree
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Download App */}
          {(links.app.playStore || links.app.appStore || links.app.oneLink) && (
            <div>
              <h3 className={`${HEADING_CLASS} mb-5`}>
                Download App
              </h3>
              <ul className="space-y-3">
                {links.app.playStore && (
                  <li>
                    <Link
                      href={links.app.playStore}
                      className={LINK_CLASS}
                    >
                      Get on Android
                    </Link>
                  </li>
                )}
                {links.app.appStore && (
                  <li>
                    <Link
                      href={links.app.appStore}
                      className={LINK_CLASS}
                    >
                      Get on iPhone
                    </Link>
                  </li>
                )}
                {!links.app.playStore && !links.app.appStore && links.app.oneLink && (
                  <li>
                    <Link
                      href={links.app.oneLink}
                      className={LINK_CLASS}
                    >
                      Get the App
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Legal */}
          {(links.legal.termsOfService || links.legal.privacyPolicy) && (
            <div>
              <h3 className={`${HEADING_CLASS} mb-5`}>
                Legal
              </h3>
              <ul className="space-y-3">
                {links.legal.termsOfService && (
                  <li>
                    <Link
                      href={links.legal.termsOfService}
                      className={LINK_CLASS}
                    >
                      Terms &amp; Conditions
                    </Link>
                  </li>
                )}
                {links.legal.privacyPolicy && (
                  <li>
                    <Link
                      href={links.legal.privacyPolicy}
                      className={LINK_CLASS}
                    >
                      Privacy Policy
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-14 flex items-center gap-1 border-t border-white/15 pt-6">
          <p className="text-micro font-light text-acre-gray-border">
            © <CopyrightYear /> All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
