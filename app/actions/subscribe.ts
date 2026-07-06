"use server";

import { ENV } from "@/lib/env";

export type SubscribeState = {
  error?: string;
  success?: boolean;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeEmail(
  _prevState: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const raw = formData.get("email");

  if (typeof raw !== "string") {
    return { error: "Please enter a valid email address." };
  }

  const email = raw.trim().toLowerCase().slice(0, 254);

  if (!EMAIL_REGEX.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const baseUrl = ENV.ACRE_API_URL;
  if (!baseUrl) {
    return { error: "Service unavailable. Please try again later." };
  }

  try {
    const res = await fetch(`${baseUrl}/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const message =
        data?.error?.message ?? "Subscription failed. Please try again.";
      return { error: message };
    }

    return { success: true };
  } catch {
    return { error: "Network error. Please try again later." };
  }
}
