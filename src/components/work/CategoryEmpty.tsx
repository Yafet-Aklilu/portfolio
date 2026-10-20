import { cn } from "@/lib/cn";
import type { WorkCategory } from "@/lib/content";

const SLOT_COPY: Record<WorkCategory["treatment"], string[]> = {
  list: ["Featured build", "Product surface", "Systems work"],
  frames: ["Flow study", "Interface system", "Detail pass"],
  poster: ["Lead composition", "Secondary piece"],
  motion: ["Lead cut", "Supporting edit"],
};

export function CategoryEmpty({ category }: { category: WorkCategory }) {
  const slots = SLOT_COPY[category.treatment];

  return (
    <div className="border-t border-line pt-12 lg:pt-16">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-5">
          <p className="text-label text-muted">Selected work</p>
          <p className="mt-4 max-w-md text-ink-muted lg:text-[length:var(--text-body-lg)]">
            {category.empty}
          </p>
        </div>

        <div
          className={cn(
            "min-w-0 lg:col-span-7",
            category.treatment === "list" && "space-y-0",
            category.treatment === "frames" && "grid gap-4 sm:grid-cols-3",
            category.treatment === "poster" && "grid gap-4 sm:grid-cols-2",
            category.treatment === "motion" && "grid gap-4 sm:grid-cols-2",
          )}
        >
          {slots.map((label, index) => (
            <div
              key={label}
              className={cn(
                "border border-line bg-bg-elevated",
                category.treatment === "list" &&
                  "flex items-center justify-between gap-6 border-x-0 border-t-0 px-0 py-7 first:border-t last:border-b",
                category.treatment === "poster" && "aspect-[4/5] p-5",
                category.treatment === "frames" && "aspect-[4/3] p-4",
                category.treatment === "motion" && "aspect-video p-5",
              )}
            >
              <div
                className={cn(
                  category.treatment !== "list" &&
                    "flex h-full flex-col justify-between",
                  category.treatment === "list" &&
                    "flex w-full min-w-0 items-baseline justify-between gap-6",
                )}
              >
                <p className="text-label text-muted">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="min-w-0">
                  <p className="text-title text-xl md:text-2xl">{label}</p>
                  <p className="text-label mt-2 text-ink-subtle">Coming soon</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
