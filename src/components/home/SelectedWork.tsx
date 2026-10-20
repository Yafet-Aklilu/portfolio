"use client";

import Link from "next/link";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/layout/Container";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  getFeaturedProjects,
  homeCopy,
  workCategories,
  type Project,
} from "@/lib/content";
import { getGsap } from "@/lib/gsap";

function FeaturedProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const meta = [
    project.softwareFocus?.[0]?.replace("-", " "),
    ...project.categories,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="group border-t border-line py-8 lg:py-12">
      <Link
        href={
          project.presentation === "page"
            ? `/work/${project.slug}`
            : `/work/${project.categories[0] ?? "software"}`
        }
        className="grid items-end gap-4 lg:grid-cols-12 lg:gap-8"
      >
        <p className="text-label text-muted lg:col-span-1">
          {String(index + 1).padStart(2, "0")}
        </p>
        <div className="lg:col-span-7">
          <p className="text-label text-muted">{meta || project.role}</p>
          <h3 className="text-title mt-3 transition-opacity group-hover:opacity-55 lg:mt-4 lg:text-5xl">
            {project.name}
          </h3>
        </div>
        <div className="flex items-end justify-between gap-4 lg:col-span-4 lg:justify-end">
          <p className="max-w-xs text-sm text-ink-muted lg:text-right">
            {project.summary}
          </p>
          <span className="text-label shrink-0 text-muted">{project.year}</span>
        </div>
      </Link>
    </article>
  );
}

function WorkEmptyState() {
  return (
    <div className="border-t border-line pt-10 lg:pt-14">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="text-label text-muted">Selected lanes</p>
          <p className="mt-4 max-w-md text-ink-muted lg:text-[length:var(--text-body-lg)]">
            {homeCopy.workEmpty}
          </p>
        </div>
        <ul className="lg:col-span-7">
          {workCategories.map((category, index) => (
            <li key={category.id} className="border-t border-line last:border-b">
              <Link
                href={category.href}
                className="group grid gap-3 py-6 transition-opacity hover:opacity-55 sm:grid-cols-[auto_1fr_auto] sm:items-baseline sm:gap-6"
              >
                <span className="text-label text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="text-title block text-2xl md:text-3xl">
                    {category.title}
                  </span>
                  <span className="text-label mt-2 block text-ink-subtle">
                    {category.description}
                  </span>
                </span>
                <span className="text-label text-muted">Open →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SelectedWork() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const featured = getFeaturedProjects();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-work-reveal]"), {
        y: isDesktop ? 36 : 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          once: true,
        },
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion, isDesktop, featured.length]);

  return (
    <section
      ref={rootRef}
      id="work"
      className="section-pad"
      aria-labelledby="work-heading"
    >
      <Container>
        <div
          data-work-reveal
          className="flex flex-col gap-8 pb-10 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="text-label text-muted">{homeCopy.workLabel}</p>
            <h2 id="work-heading" className="text-headline mt-5 max-w-[12ch]">
              {homeCopy.workHeadline}
            </h2>
          </div>
          <ButtonLink
            href="/work"
            variant="ghost"
            className="self-start lg:self-auto"
          >
            {homeCopy.workCta}
            <span aria-hidden>→</span>
          </ButtonLink>
        </div>

        <div data-work-reveal>
          {featured.length > 0 ? (
            <div>
              {featured.map((project, index) => (
                <FeaturedProjectRow
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
              <div className="border-t border-line" />
            </div>
          ) : (
            <WorkEmptyState />
          )}
        </div>
      </Container>
    </section>
  );
}
