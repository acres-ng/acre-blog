import { cacheLife, cacheTag } from "next/cache";
import type { AcreResponse, AppSettings } from "@/types/acre";
import { ENV } from "@/lib/env";
import { acreGet } from "./client";

/** Shape consumed by the layout components — API values with env fallbacks applied. */
export interface SiteLinks {
  logoUrl: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
  websiteUrl: string;
  social: {
    whatsapp: string | null;
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    youtube: string | null;
    tiktok: string | null;
  };
  app: {
    playStore: string | null;
    appStore: string | null;
    oneLink: string | null;
  };
  legal: {
    privacyPolicy: string | null;
    termsOfService: string | null;
  };
}

/** First non-empty value, or null. */
function pick(...values: (string | null | undefined)[]): string | null {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return null;
}

export async function getAppSettings(): Promise<AppSettings | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("app-settings");

  try {
    const res = await acreGet<AcreResponse<AppSettings>>("/app-settings");
    return res.data ?? null;
  } catch (error) {
    // Nav and footer must render even when the settings API is down —
    // callers fall back to the env-configured links.
    console.error("[acre] failed to load app settings", error);
    return null;
  }
}

export async function getSiteLinks(): Promise<SiteLinks> {
  "use cache";
  cacheLife("hours");
  cacheTag("app-settings");

  const settings = await getAppSettings();
  const social = settings?.social_links;
  const app = settings?.app_links;
  const legal = settings?.legal_links;
  const website = ENV.ACRE_WEBSITE_URL;

  return {
    logoUrl: pick(settings?.logo_url),
    supportEmail: pick(settings?.support_email, ENV.ACRE_EMAIL),
    supportPhone: pick(settings?.support_phone),
    websiteUrl: website,
    social: {
      whatsapp: pick(social?.whatsapp, ENV.SOCIAL_WHATSAPP),
      facebook: pick(social?.facebook, ENV.SOCIAL_FACEBOOK),
      instagram: pick(social?.instagram),
      twitter: pick(social?.twitter, ENV.SOCIAL_TWITTER),
      linkedin: pick(social?.linkedin, ENV.SOCIAL_LINKEDIN),
      youtube: pick(social?.youtube),
      tiktok: pick(social?.tiktok),
    },
    app: {
      playStore: pick(app?.play_store, ENV.PLAYSTORE_APP_LINK),
      appStore: pick(app?.app_store, ENV.APP_STORE_APP_LINK),
      oneLink: pick(app?.onelink, ENV.ACRE_ONE_LINK),
    },
    legal: {
      privacyPolicy: pick(
        legal?.privacy_policy,
        website ? `${website}/privacy-policy` : null,
      ),
      termsOfService: pick(
        legal?.terms_of_service,
        website ? `${website}/terms-of-use` : null,
      ),
    },
  };
}
