export const COLORS = {
  acre_primary: "#1B9C5C",
  acre_primary_dark: "#006D38",
  acre_tag_bg: "#DBEFE6",
  acre_text: "#2D2D2D",
  acre_muted: "#7C7D7D",
  acre_hero_bg: "#F5F8F4",
  acre_newsletter_bg: "#DBEFE6",
} as const;

export type AcreColor = (typeof COLORS)[keyof typeof COLORS];
