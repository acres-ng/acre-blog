import Link from "next/link";
import { COLORS } from "@/lib/colors";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  color?: string;
  textColor?: string;
};

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
    href?: never;
  };

type ButtonAsLink = BaseProps & {
  href: string;
  onClick?: () => void;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-block text-sm font-medium px-5 py-2 rounded-xl transition-colors disabled:opacity-70 whitespace-nowrap";

export function Button({
  children,
  className,
  color = COLORS.acre_primary,
  textColor = "#ffffff",
  ...props
}: ButtonProps) {
  const cls = [base, className].filter(Boolean).join(" ");
  const style = { backgroundColor: color, color: textColor };

  if ("href" in props && props.href !== undefined) {
    const { href, onClick } = props;
    return (
      <Link href={href} className={cls} style={style} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button className={cls} style={style} {...rest}>
      {children}
    </button>
  );
}
