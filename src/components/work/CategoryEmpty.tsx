import type { WorkCategory } from "@/lib/content";

export function CategoryEmpty({ category }: { category: WorkCategory }) {
  return (
    <div className="border-t border-line pt-12 lg:pt-16">
      <div className="max-w-xl">
        <p className="text-label text-muted">Selected work</p>
        <p className="mt-4 text-ink-muted lg:text-[length:var(--text-body-lg)]">
          {category.empty}
        </p>
      </div>
    </div>
  );
}
