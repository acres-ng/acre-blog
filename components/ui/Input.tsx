import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export function Input({ className, ...props }: InputProps) {
  const cls = [
    "px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-acre-green focus:ring-1 focus:ring-acre-green bg-white placeholder:text-gray-400",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <input className={cls} {...props} />;
}
