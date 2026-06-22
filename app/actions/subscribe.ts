"use server";

export type SubscribeState = {
  error?: string;
  success?: boolean;
};

export async function subscribeEmail(
  _prevState: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  // TODO: Integrate with email service or Strapi endpoint
  return { success: true };
}
