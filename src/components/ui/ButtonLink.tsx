import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "line";
  className?: string;
  external?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className,
  external,
}: ButtonLinkProps) {
  const classes = cn(
    "btn",
    variant === "solid" && "btn-solid",
    variant === "ghost" && "btn-ghost",
    variant === "line" && "btn-line",
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
