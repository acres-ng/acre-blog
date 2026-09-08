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

export async function Footer() {
  const links = await getSiteLinks();

  const socials = SOCIAL_ORDER.map((key) => ({
    key,
    href: links.social[key],
  })).filter((s): s is { key: SocialKey; href: string } => Boolean(s.href));

  return (
    <footer className="bg-acre-green-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand + social */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" aria-label="acre — home">
              <Image
                src="/images/logo-white.png"
                alt="acre — Helping you grow"
                width={120}
                height={42}
                className="h-9 w-auto"
              />
            </Link>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-6">
                {socials.map(({ key, href }) => (
                  <a
                    key={key}
                    href={href}
                    aria-label={SOCIAL_LABELS[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <SocialIcon name={key} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {links.websiteUrl && (
                <li>
                  <Link
                    href={links.websiteUrl}
                    className="text-sm text-white/75 hover:text-white transition-colors"
                  >
                    Our Mission
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/"
                  className="text-sm text-white/75 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              {links.supportEmail && (
                <li>
                  <Link
                    href={`mailto:${links.supportEmail}`}
                    className="text-sm text-white/75 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              )}
              {links.supportPhone && (
                <li>
                  <Link
                    href={`tel:${links.supportPhone.replace(/\s+/g, "")}`}
                    className="text-sm text-white/75 hover:text-white transition-colors"
                  >
                    {links.supportPhone}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Download App */}
          {(links.app.playStore || links.app.appStore || links.app.oneLink) && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">
                Download App
              </h3>
              <ul className="space-y-3">
                {links.app.playStore && (
                  <li>
                    <Link
                      href={links.app.playStore}
                      className="text-sm text-white/75 hover:text-white transition-colors"
                    >
                      Get on Android
                    </Link>
                  </li>
                )}
                {links.app.appStore && (
                  <li>
                    <Link
                      href={links.app.appStore}
                      className="text-sm text-white/75 hover:text-white transition-colors"
                    >
                      Get on iPhone
                    </Link>
                  </li>
                )}
                {!links.app.playStore && !links.app.appStore && links.app.oneLink && (
                  <li>
                    <Link
                      href={links.app.oneLink}
                      className="text-sm text-white/75 hover:text-white transition-colors"
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
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {links.legal.termsOfService && (
                  <li>
                    <Link
                      href={links.legal.termsOfService}
                      className="text-sm text-white/75 hover:text-white transition-colors"
                    >
                      Terms &amp; Conditions
                    </Link>
                  </li>
                )}
                {links.legal.privacyPolicy && (
                  <li>
                    <Link
                      href={links.legal.privacyPolicy}
                      className="text-sm text-white/75 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10">
          <p className="text-xs text-white/35">
            © <CopyrightYear /> All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
