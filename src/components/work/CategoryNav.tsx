import Link from "next/link";
import { workCategories, type WorkCategoryId } from "@/lib/content";
import { cn } from "@/lib/cn";

export function CategoryNav({ active }: { active?: WorkCategoryId }) {
  return (
    <nav aria-label="Work categories" className="overflow-x-auto border-b border-line">
      <ul className="flex min-w-0 flex-wrap gap-x-6 gap-y-3 sm:gap-x-8">
        <li>
          <Link
            href="/"
            className="text-label pb-4 text-muted transition-opacity hover:opacity-55"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/work"
            className={cn(
              "text-label pb-4 transition-opacity hover:opacity-55",
              !active ? "border-b-2 border-ink text-ink" : "text-muted",
            )}
          >
            All work
          </Link>
        </li>
        {workCategories.map((category) => (
          <li key={category.id}>
            <Link
              href={category.href}
              className={cn(
                "text-label pb-4 transition-opacity hover:opacity-55",
                active === category.id
                  ? "border-b-2 border-ink text-ink"
                  : "text-muted",
              )}
            >
              {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
