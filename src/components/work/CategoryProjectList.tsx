"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProjectModal } from "@/components/project/ProjectModal";
import { CategoryEmpty } from "@/components/work/CategoryEmpty";
import {
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

  return (
    <>
      {category.id === "software" ? (
        <div className="mb-10 flex flex-wrap gap-3 border-t border-line pt-8">
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
            category.treatment === "list" &&
              "divide-y divide-line border-y border-line",
            category.treatment === "poster" && "grid gap-8 lg:grid-cols-2",
            category.treatment === "frames" && "grid gap-6 lg:grid-cols-3",
            category.treatment === "motion" && "grid gap-8 lg:grid-cols-2",
          )}
        >
          {visible.map((project, index) => {
            const openModal =
              category.id === "software" || project.presentation === "modal";

            const body = (
              <>
                {project.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.images[0].src}
                    alt={project.images[0].alt}
                    className={cn(
                      "w-full border border-line bg-bg-elevated object-cover transition-opacity group-hover:opacity-90",
                      category.treatment === "poster" && "aspect-[4/5]",
                      category.treatment === "frames" && "aspect-[4/3]",
                      category.treatment === "motion" && "aspect-video",
                      category.treatment === "list" && "hidden",
                    )}
                  />
                ) : category.treatment !== "list" ? (
                  <div
                    className={cn(
                      "flex items-end border border-line bg-bg-elevated p-4",
                      category.treatment === "poster" && "aspect-[4/5]",
                      category.treatment === "frames" && "aspect-[4/3]",
                      category.treatment === "motion" && "aspect-video",
                    )}
                  >
                    <p className="text-label text-muted">No cover yet</p>
                  </div>
                ) : null}

                <div
                  className={cn(
                    category.treatment === "list"
                      ? "grid gap-4 py-8 lg:grid-cols-12 lg:items-end lg:gap-8"
                      : "mt-4",
                  )}
                >
                  {category.treatment === "list" ? (
                    <p className="text-label text-muted lg:col-span-1">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  ) : null}
                  <div
                    className={cn(
                      category.treatment === "list" && "lg:col-span-7",
                    )}
                  >
                    <p className="text-label text-muted">
                      {projectMeta(project)}
                    </p>
                    <h2 className="text-title mt-3 text-2xl transition-opacity group-hover:opacity-55 md:text-3xl lg:text-4xl">
                      {project.name}
                    </h2>
                  </div>
                  <div
                    className={cn(
                      category.treatment === "list" &&
                        "flex items-end justify-between gap-4 lg:col-span-4 lg:justify-end",
                    )}
                  >
                    <p className="mt-3 max-w-md text-sm text-ink-muted lg:mt-0 lg:text-right">
                      {project.summary}
                    </p>
                    {category.treatment === "list" ? (
                      <span className="text-label shrink-0 text-muted">
                        {project.year}
                      </span>
                    ) : (
                      <p className="text-label mt-3 text-muted">{project.year}</p>
                    )}
                  </div>
                </div>
              </>
            );

            return (
              <li key={project.id}>
                {openModal ? (
                  <button
                    type="button"
                    className="group w-full text-left"
                    onClick={() => setActiveProject(project)}
                  >
                    {body}
                  </button>
                ) : project.presentation === "page" ? (
                  <Link href={`/work/${project.slug}`} className="group block">
                    {body}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="group w-full text-left"
                    onClick={() => setActiveProject(project)}
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
