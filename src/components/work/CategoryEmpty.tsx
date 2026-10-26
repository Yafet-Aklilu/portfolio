import { cn } from "@/lib/cn";
import type { WorkCategory } from "@/lib/content";

const SLOT_COPY: Record<WorkCategory["treatment"], string[]> = {
  cards: ["Project one", "Project two", "Project three", "Project four"],
  frames: ["Flow study", "Interface system", "Detail pass"],
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
            category.treatment === "cards" &&
              "grid grid-cols-2 gap-4 lg:grid-cols-4",
            category.treatment === "frames" && "grid gap-4 sm:grid-cols-3",
            category.treatment === "motion" && "grid gap-4 sm:grid-cols-2",
          )}
        >
          {slots.map((label, index) => (
            <div
              key={label}
              className={cn(
                "border border-line bg-bg-elevated",
                category.treatment === "cards" && "aspect-[3/4] p-3",
                category.treatment === "frames" && "aspect-[4/3] p-4",
                category.treatment === "motion" && "aspect-video p-5",
              )}
            >
              <div className="flex h-full flex-col justify-between">
                <p className="text-label text-muted">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="min-w-0">
                  <p className="text-title text-base md:text-xl">{label}</p>
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
