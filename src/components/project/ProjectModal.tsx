"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { findTechMark, type Project } from "@/lib/content";
import { getGsap } from "@/lib/gsap";

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
  backHref?: string;
  backLabel?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

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

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted || !project) return null;

  const meta = [
    ...(project.softwareFocus?.map((focus) => focus.replace("-", " ")) ?? []),
    ...project.categories,
  ].join(" · ");

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-6 lg:p-10"
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
        className="flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden border border-line bg-bg shadow-[0_-12px_40px_rgba(0,0,0,0.12)] outline-none sm:max-h-[88dvh] sm:shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-5 sm:px-8">
          <div className="min-w-0">
            <p className="text-label text-muted">{meta || project.role}</p>
            <h2
              id={titleId}
              className="text-title mt-3 text-3xl sm:text-4xl lg:text-5xl"
            >
              {project.name}
            </h2>
            <p className="text-label mt-3 text-muted">{project.year}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="btn btn-line shrink-0 !px-3 !py-2"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8">
          <p
            id={descriptionId}
            className="max-w-2xl text-ink-muted lg:text-[length:var(--text-body-lg)]"
          >
            {project.summary}
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-label text-muted">Role</p>
              <p className="mt-2">{project.role}</p>
            </div>
            {project.softwareFocus && project.softwareFocus.length > 0 ? (
              <div>
                <p className="text-label text-muted">Software focus</p>
                <p className="mt-2 capitalize">
                  {project.softwareFocus
                    .map((focus) => focus.replace("-", " "))
                    .join(" · ")}
                </p>
              </div>
            ) : null}
          </div>

          {project.technologies.length > 0 ? (
            <div className="mt-10">
              <p className="text-label text-muted">Technologies</p>
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
            </div>
          ) : null}

          {project.images.length > 0 ? (
            <div className="mt-10 space-y-4">
              <p className="text-label text-muted">Screens</p>
              {project.images.map((image) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  className="w-full border border-line bg-bg-elevated"
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 border border-line bg-bg-elevated px-5 py-8">
              <p className="text-label text-muted">Screens</p>
              <p className="mt-3 max-w-md text-sm text-ink-muted">
                Project imagery will show here when available.
              </p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            {project.liveUrl ? (
              <ButtonLink href={project.liveUrl} variant="solid" external>
                Live site
              </ButtonLink>
            ) : null}
            {project.githubUrl ? (
              <ButtonLink href={project.githubUrl} variant="line" external>
                GitHub
              </ButtonLink>
            ) : null}
            {project.presentation === "page" ||
            project.problem ||
            project.approach ||
            project.outcome ? (
              <ButtonLink href={`/work/${project.slug}`} variant="ghost">
                Full case study
                <span aria-hidden>→</span>
              </ButtonLink>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4 sm:px-8">
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
