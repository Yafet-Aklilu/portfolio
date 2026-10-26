"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SafeImage } from "@/components/ui/SafeImage";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  findTechMark,
  getProjectCover,
  getProjectScreenshots,
  type Project,
  type ProjectImage,
} from "@/lib/content";
import { getGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
  backHref?: string;
  backLabel?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function uniqueGallery(
  cover: ProjectImage | undefined,
  screenshots: ProjectImage[],
): ProjectImage[] {
  const items: ProjectImage[] = [];
  const seen = new Set<string>();
  for (const image of [cover, ...screenshots]) {
    if (!image?.src || seen.has(image.src)) continue;
    seen.add(image.src);
    items.push(image);
  }
  return items;
}

export function ProjectModal({
  project,
  onClose,
  backHref = "/work/software",
  backLabel = "Back to software",
}: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const reducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setGalleryIndex(0);
  }, [project?.id]);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    const panel = panelRef.current;
    if (!panel || event.key !== "Tab") return;

    const nodes = [
      ...panel.querySelectorAll<HTMLElement>(FOCUSABLE),
    ].filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

    if (nodes.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!project) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        // Gallery navigation handled in a separate effect with gallery length
      }
      trapFocus(event);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [project, onClose, trapFocus]);

  useIsomorphicLayoutEffect(() => {
    if (!project || !panelRef.current || !dialogRef.current) return;

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([dialogRef.current, panelRef.current], { clearProps: "all" });
        return;
      }

      gsap.fromTo(
        dialogRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      );
      gsap.fromTo(
        panelRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.04 },
      );
    });

    closeRef.current?.focus();

    return () => ctx.revert();
  }, [project, reducedMotion]);

  const gallery = useMemo(() => {
    if (!project) return [];
    return uniqueGallery(
      getProjectCover(project),
      getProjectScreenshots(project),
    );
  }, [project]);

  useEffect(() => {
    if (!project || gallery.length < 2) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setGalleryIndex((index) => (index + 1) % gallery.length);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setGalleryIndex(
          (index) => (index - 1 + gallery.length) % gallery.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [project, gallery.length]);

  if (!mounted || !project) return null;

  const cover = getProjectCover(project);
  const screenshots = getProjectScreenshots(project);
  const activeImage = gallery[galleryIndex] ?? cover;
  const overview =
    project.overview?.trim() ||
    project.intro?.trim() ||
    project.summary?.trim() ||
    project.problem?.trim() ||
    "";
  const contribution =
    project.contribution?.trim() || project.approach?.trim() || "";
  const role = project.role?.trim() || "";
  const features = project.features?.filter((item) => item.trim()) ?? [];
  const showMobile =
    Boolean(project.hasMobileApp) && Boolean(project.mobileMockup?.src);
  const hasLive = Boolean(project.liveUrl?.trim());
  const hasGithub = Boolean(project.githubUrl?.trim());
  const isGraphic = project.categories.includes("graphic");

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4 lg:p-8"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="flex max-h-[96dvh] w-full max-w-6xl flex-col overflow-hidden border border-line bg-bg shadow-[0_-12px_40px_rgba(0,0,0,0.12)] outline-none sm:max-h-[92dvh] lg:max-w-7xl sm:shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-6 sm:py-4">
          <p className="text-label text-muted">
            {isGraphic ? "Graphic design" : "Project"}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="btn btn-line shrink-0 !px-3 !py-2"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div
            className={cn(
              "border-b border-line bg-bg-elevated",
              isGraphic && "flex min-h-[40dvh] items-center justify-center",
            )}
          >
            <SafeImage
              src={activeImage?.src}
              alt={activeImage?.alt ?? `${project.name} artwork`}
              className={cn(
                "block",
                isGraphic
                  ? "mx-auto h-auto max-h-[70dvh] w-auto max-w-full object-contain"
                  : "aspect-[16/9] max-h-[58dvh] w-full object-cover",
              )}
              fallbackClassName={
                isGraphic ? "aspect-square w-full" : "aspect-[16/9] w-full"
              }
              fallbackLabel="Artwork coming soon"
            />
          </div>

          <div className="space-y-10 px-5 py-8 sm:space-y-12 sm:px-8 sm:py-10 lg:px-10">
            <header className="max-w-3xl">
              <h2
                id={titleId}
                className="text-title text-3xl sm:text-4xl lg:text-5xl"
              >
                {project.name}
              </h2>
              {overview ? (
                <p
                  id={descriptionId}
                  className="mt-5 text-ink-muted lg:text-[length:var(--text-body-lg)]"
                >
                  {overview}
                </p>
              ) : (
                <p id={descriptionId} className="sr-only">
                  {project.name} project details
                </p>
              )}
            </header>

            {gallery.length > 1 ? (
              <section aria-label="Artwork gallery">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="text-label text-muted">Gallery</p>
                  <p className="text-label text-ink-subtle">
                    {galleryIndex + 1} / {gallery.length}
                  </p>
                </div>
                <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {gallery.map((image, index) => (
                    <li key={image.src}>
                      <button
                        type="button"
                        className={cn(
                          "w-full overflow-hidden border bg-bg-elevated transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                          index === galleryIndex
                            ? "border-ink"
                            : "border-line opacity-70 hover:opacity-100",
                        )}
                        aria-label={`Show image ${index + 1}`}
                        aria-pressed={index === galleryIndex}
                        onClick={() => setGalleryIndex(index)}
                      >
                        <SafeImage
                          src={image.src}
                          alt=""
                          className="aspect-square h-auto w-full object-cover"
                          fallbackClassName="aspect-square w-full"
                          fallbackLabel="—"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-ink-subtle">
                  Use arrow keys or tap a thumbnail to browse.
                </p>
              </section>
            ) : null}

            {role ? (
              <section>
                <p className="text-label text-muted">My role</p>
                <p className="mt-3 text-ink-muted">{role}</p>
              </section>
            ) : null}

            {contribution ? (
              <section>
                <p className="text-label text-muted">My contribution</p>
                <p className="mt-3 max-w-3xl text-ink-muted lg:text-[length:var(--text-body-lg)]">
                  {contribution}
                </p>
              </section>
            ) : null}

            {features.length > 0 ? (
              <section>
                <p className="text-label text-muted">Key features</p>
                <ul className="mt-4 max-w-2xl space-y-3">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="border-l border-line pl-4 text-ink-muted"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {project.technologies.length > 0 ? (
              <section>
                <p className="text-label text-muted">Technology stack</p>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {project.technologies.map((tech) => {
                    const mark = findTechMark(tech);
                    return (
                      <li
                        key={tech}
                        className="flex items-center gap-2 border border-line bg-bg-elevated px-3 py-2"
                      >
                        {mark ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={mark.logoSrc}
                            alt=""
                            width={18}
                            height={18}
                            className="h-[18px] w-[18px] opacity-80"
                          />
                        ) : null}
                        <span className="text-label">{tech}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {!isGraphic && screenshots.length > 0 && gallery.length <= 1 ? (
              <section>
                <p className="text-label text-muted">Visual showcase</p>
                <div className="mt-4 space-y-4">
                  {screenshots.map((image) => (
                    <SafeImage
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      className="h-auto w-full border border-line bg-bg-elevated object-contain"
                      fallbackClassName="aspect-[16/10] w-full"
                      fallbackLabel="Screenshot coming soon"
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {showMobile ? (
              <section>
                <p className="text-label text-muted">Mobile application</p>
                <div className="mt-4 max-w-sm">
                  <SafeImage
                    src={project.mobileMockup!.src}
                    alt={project.mobileMockup!.alt}
                    className="h-auto w-full border border-line bg-bg-elevated object-contain"
                    fallbackClassName="aspect-[9/16] w-full"
                    fallbackLabel="Mobile mockup coming soon"
                  />
                </div>
              </section>
            ) : null}

            {hasLive || hasGithub ? (
              <section className="flex flex-wrap gap-3 border-t border-line pt-8">
                {hasLive ? (
                  <ButtonLink href={project.liveUrl!} variant="solid" external>
                    Live Preview
                  </ButtonLink>
                ) : null}
                {hasGithub ? (
                  <ButtonLink href={project.githubUrl!} variant="line" external>
                    GitHub
                  </ButtonLink>
                ) : null}
              </section>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-line px-5 py-3.5 sm:px-8">
          <Link
            href={backHref}
            className="text-label text-muted transition-opacity hover:opacity-55"
            onClick={onClose}
          >
            {backLabel}
          </Link>
          <Link
            href="/"
            className="text-label text-muted transition-opacity hover:opacity-55"
            onClick={onClose}
          >
            Home
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
