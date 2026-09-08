// Types for the Acre platform API (NEXT_PUBLIC_ACRE_API_URL).

export interface AcreResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface AppSettingsSocialLinks {
  whatsapp?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
}

export interface AppSettingsAppLinks {
  play_store?: string | null;
  app_store?: string | null;
  onelink?: string | null;
}

export interface AppSettingsLegalLinks {
  privacy_policy?: string | null;
  terms_of_service?: string | null;
}

/** GET /app-settings */
export interface AppSettings {
  logo_url?: string | null;
  support_email?: string | null;
  support_phone?: string | null;
  social_links?: AppSettingsSocialLinks | null;
  app_links?: AppSettingsAppLinks | null;
  legal_links?: AppSettingsLegalLinks | null;
}
