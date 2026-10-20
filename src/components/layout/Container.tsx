import { cn } from "@/lib/cn";

type ContainerProps = {
  as?: "div" | "section" | "header" | "footer" | "main" | "nav";
  className?: string;
  children: React.ReactNode;
};

export function Container({
  as: Tag = "div",
  className,
  children,
}: ContainerProps) {
  return <Tag className={cn("container-page", className)}>{children}</Tag>;
}
