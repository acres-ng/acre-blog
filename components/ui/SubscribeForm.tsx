"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { subscribeEmail } from "@/app/actions/subscribe";
import type { SubscribeState } from "@/app/actions/subscribe";

const initialState: SubscribeState = {};

export function SubscribeForm({ variant = "default" }: { variant?: "default" | "inline" | "stacked" }) {
  const [state, action, pending] = useActionState(subscribeEmail, initialState);

  if (state.success) {
    return (
      <p className="text-acre-green font-medium text-sm text-center sm:text-left">
        You&apos;re subscribed! Check your inbox.
      </p>
    );
  }

  if (variant === "inline") {
    return (
      <form action={action} className="w-full max-w-md mx-auto sm:mx-0">
        <div className="flex items-center rounded-xl border border-gray-300 bg-white focus-within:border-acre-green focus-within:ring-1 focus-within:ring-acre-green overflow-hidden pr-1.5">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={pending}
            className="flex-shrink-0 bg-acre-green-dark text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-acre-green-hover transition-colors disabled:opacity-70 whitespace-nowrap"
          >
            {pending ? "..." : "Subscribe"}
          </button>
        </div>
        {state.error && (
          <p className="text-red-500 text-xs mt-2 pl-4">{state.error}</p>
        )}
      </form>
    );
  }

  if (variant === "stacked") {
    return (
      <form action={action} className="w-full">
        <div className="flex flex-col gap-2">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="w-full"
          />
          <Button type="submit" disabled={pending} className="w-full py-2.5 text-center">
            {pending ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>
        {state.error && (
          <p className="text-red-500 text-xs mt-2 pl-4">{state.error}</p>
        )}
      </form>
    );
  }

  return (
    <form action={action} className="w-full max-w-md mx-auto sm:mx-0">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="flex-1"
        />
        <Button type="submit" disabled={pending} className="px-6 py-2.5">
          {pending ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>
      {state.error && (
        <p className="text-red-500 text-xs mt-2 pl-4">{state.error}</p>
      )}
    </form>
  );
}
