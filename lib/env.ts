export const ENV = {
  STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL ?? "",
  STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN ?? "",
  STRAPI_HOSTNAME: process.env.STRAPI_HOSTNAME ?? "",
  STRAPI_REVALIDATE_SECRET: process.env.STRAPI_REVALIDATE_SECRET ?? "",
  STRAPI_DRAFT_SECRET: process.env.STRAPI_DRAFT_SECRET ?? "",
  LOG_LEVEL: process.env.LOG_LEVEL ?? "",
  ACRE_API_URL: process.env.NEXT_PUBLIC_ACRE_API_URL ?? "",
  ACRE_ONE_LINK: process.env.ACRE_ONE_LINK ?? "",
  // Defaulted rather than left empty: the navbar and footer build every
  // cross-property link from this, so an unset value turns them into
  // relative URLs that resolve against the blog and 404. `||` not `??`,
  // because an empty string reaches here as often as an unset var.
  ACRE_WEBSITE_URL: process.env.ACRE_WEBSITE_URL || "https://www.acre-life.com",
  ACRE_EMAIL: process.env.ACRE_EMAIL ?? "",
  PLAYSTORE_APP_LINK: process.env.PLAYSTORE_APP_LINK ?? "",
  APP_STORE_APP_LINK: process.env.APP_STORE_APP_LINK ?? "",
  SOCIAL_WHATSAPP: process.env.SOCIAL_WHATSAPP ?? "",
  SOCIAL_LINKEDIN: process.env.SOCIAL_LINKEDIN ?? "",
  SOCIAL_FACEBOOK: process.env.SOCIAL_FACEBOOK ?? "",
  SOCIAL_TWITTER: process.env.SOCIAL_TWITTER ?? "",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;
