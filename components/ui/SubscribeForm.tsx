"use client";

import { useActionState } from "react";
import { subscribeEmail } from "@/app/actions/subscribe";
import type { SubscribeState } from "@/app/actions/subscribe";

const initialState: SubscribeState = {};

export function SubscribeForm() {
  const [state, action, pending] = useActionState(subscribeEmail, initialState);

  if (state.success) {
    return (
      <p className="text-acre-green font-medium text-sm text-center sm:text-left">
        You&apos;re subscribed! Check your inbox.
      </p>
    );
  }

  return (
    <form action={action} className="w-full max-w-md mx-auto sm:mx-0">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 text-sm outline-none focus:border-acre-green focus:ring-1 focus:ring-acre-green bg-white"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-acre-green-dark text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-acre-green-hover transition-colors disabled:opacity-70 whitespace-nowrap"
        >
          {pending ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {state.error && (
        <p className="text-red-500 text-xs mt-2 pl-4">{state.error}</p>
      )}
    </form>
  );
}
