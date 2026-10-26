"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProjectModal } from "@/components/project/ProjectModal";
import { SafeImage } from "@/components/ui/SafeImage";
import { CategoryEmpty } from "@/components/work/CategoryEmpty";
import {
  getProjectCover,
  softwareFocusFilters,
  type Project,
  type SoftwareFocus,
  type WorkCategory,
} from "@/lib/content";
import { cn } from "@/lib/cn";

type CategoryProjectListProps = {
  category: WorkCategory;
  projects: Project[];
};

function projectMeta(project: Project) {
  return [
    ...(project.softwareFocus?.map((focus) => focus.replace("-", " ")) ?? []),
    project.role,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function CategoryProjectList({
  category,
  projects,
}: CategoryProjectListProps) {
  const [focus, setFocus] = useState<SoftwareFocus | "all">("all");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const visible = useMemo(() => {
    if (category.id !== "software" || focus === "all") return projects;
    return projects.filter((project) => project.softwareFocus?.includes(focus));
  }, [category.id, focus, projects]);

  if (projects.length === 0) {
    return <CategoryEmpty category={category} />;
  }

  const isCards = category.treatment === "cards";
  const isGraphic = category.id === "graphic";

  return (
    <>
      {category.id === "software" ? (
        <div className="mb-8 flex flex-wrap gap-3 border-t border-line pt-8">
          {softwareFocusFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setFocus(filter.id)}
              className={cn(
                "btn border px-4 py-2",
                focus === filter.id
                  ? "btn-solid border-transparent"
                  : "border-line bg-transparent text-muted hover:border-ink hover:text-ink",
              )}
              aria-pressed={focus === filter.id}
            >
              {filter.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="border-t border-line pt-8" />
      )}

      {visible.length === 0 ? (
        <div className="border border-line bg-bg-elevated px-5 py-10">
          <p className="text-label text-muted">No matches</p>
          <p className="mt-3 max-w-md text-ink-muted">
            Nothing in this software focus yet. Try All, or check back when
            projects are published.
          </p>
        </div>
      ) : (
        <ul
          className={cn(
            isCards &&
              "grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4",
            category.treatment === "frames" && "grid gap-6 lg:grid-cols-3",
            category.treatment === "motion" && "grid gap-8 lg:grid-cols-2",
          )}
        >
          {visible.map((project) => {
            const openModal =
              category.id === "software" ||
              category.id === "graphic" ||
              project.presentation === "modal";
            const cover = getProjectCover(project);
            const blurb =
              project.summary.trim() || "Project details coming soon.";

            const body = isCards ? (
              <div className="flex h-full flex-col overflow-hidden border border-line bg-bg-elevated transition-[border-color,opacity] duration-300 group-hover:border-ink group-focus-visible:border-ink">
                <SafeImage
                  src={cover?.src}
                  alt={cover?.alt ?? `${project.name} cover`}
                  className={cn(
                    "w-full transition-opacity duration-300 group-hover:opacity-90",
                    isGraphic
                      ? "aspect-square object-cover"
                      : "block h-auto",
                  )}
                  fallbackClassName={cn(
                    "w-full",
                    isGraphic ? "aspect-square" : "aspect-[16/9]",
                  )}
                  fallbackLabel="Cover soon"
                />
                <div className="flex flex-1 flex-col gap-2 px-3 py-3 sm:px-3.5 sm:py-3.5">
                  <h2 className="font-display text-base font-bold uppercase tracking-tight text-ink sm:text-lg">
                    {project.name}
                  </h2>
                  <p className="line-clamp-3 text-[13px] leading-snug text-ink-muted">
                    {blurb}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <SafeImage
                  src={cover?.src}
                  alt={cover?.alt ?? `${project.name} cover`}
                  className={cn(
                    "w-full border border-line bg-bg-elevated object-cover transition-opacity duration-300 group-hover:opacity-85 group-focus-visible:opacity-85",
                    category.treatment === "frames" && "aspect-[4/3]",
                    category.treatment === "motion" && "aspect-video",
                  )}
                  fallbackClassName={cn(
                    "w-full",
                    category.treatment === "frames" && "aspect-[4/3]",
                    category.treatment === "motion" && "aspect-video",
                  )}
                  fallbackLabel="Cover coming soon"
                />
                <div className="mt-4">
                  <p className="text-label text-muted">
                    {projectMeta(project) || category.label}
                  </p>
                  <h2 className="text-title mt-3 text-2xl transition-opacity duration-300 group-hover:opacity-55 group-focus-visible:opacity-55 md:text-3xl lg:text-4xl">
                    {project.name}
                  </h2>
                  <p className="mt-3 max-w-md text-sm text-ink-muted">{blurb}</p>
                  {project.year.trim() ? (
                    <p className="text-label mt-3 text-muted">{project.year}</p>
                  ) : null}
                </div>
              </>
            );

            const cardClass =
              "group w-full text-left outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

            return (
              <li key={project.id} className={isCards ? "min-w-0" : undefined}>
                {openModal ? (
                  <button
                    type="button"
                    className={cn(cardClass, isCards && "h-full")}
                    onClick={() => setActiveProject(project)}
                    aria-haspopup="dialog"
                  >
                    {body}
                  </button>
                ) : project.presentation === "page" ? (
                  <Link
                    href={`/work/${project.slug}`}
                    className={cn(cardClass, "block", isCards && "h-full")}
                  >
                    {body}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={cn(cardClass, isCards && "h-full")}
                    onClick={() => setActiveProject(project)}
                    aria-haspopup="dialog"
                  >
                    {body}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        backHref={category.href}
        backLabel={`Back to ${category.label.toLowerCase()}`}
      />
    </>
  );
}
