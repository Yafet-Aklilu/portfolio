"use client";

import { useMemo, useRef } from "react";
import { CvActions } from "@/components/cv/CvActions";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/layout/Container";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { homeCopy, site } from "@/lib/content";
import { getGsap } from "@/lib/gsap";

function splitChars(text: string) {
  return text.split("").map((char, index) => ({
    char: char === " " ? "\u00A0" : char,
    key: `${text}-${index}-${char}`,
  }));
}

/** Deterministic “random” exit vectors so SSR/client match */
function exitVector(index: number) {
  const pattern = [
    { x: -48, y: -130, rotate: -12 },
    { x: 56, y: -110, rotate: 14 },
    { x: -28, y: 120, rotate: 8 },
    { x: 64, y: 100, rotate: -16 },
    { x: 20, y: -140, rotate: 6 },
    { x: -60, y: 90, rotate: -10 },
    { x: 40, y: -95, rotate: 18 },
    { x: -16, y: 135, rotate: -7 },
  ];
  return pattern[index % pattern.length];
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const lines = useMemo(
    () =>
      homeCopy.heroLines.map((line) => ({
        line,
        chars: splitChars(line),
      })),
    [],
  );

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const title = titleRef.current;
    if (!root || !title) return;

    const { gsap, ScrollTrigger } = getGsap();
    const chars = title.querySelectorAll<HTMLElement>("[data-hero-char]");
    const meta = root.querySelectorAll<HTMLElement>("[data-hero-meta]");

    if (reducedMotion) {
      gsap.set([chars, meta], {
        clearProps: "all",
        opacity: 1,
        x: 0,
        y: 0,
        yPercent: 0,
        rotate: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Intro: name + meta settle in. Exit scrub waits until this finishes
      // so scroll progress 0 never locks letters off-screen.
      gsap.set(chars, { yPercent: 110, opacity: 1, x: 0, rotate: 0 });
      gsap.set(meta, { opacity: 0, y: 16 });

      const charList = Array.from(chars);
      const exitOrder = gsap.utils.shuffle([...charList]);

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          gsap.fromTo(
            exitOrder,
            {
              x: 0,
              yPercent: 0,
              opacity: 1,
              rotate: 0,
            },
            {
              x: (_i, el) => {
                const index = charList.indexOf(el as HTMLElement);
                return exitVector(index).x * (isDesktop ? 1 : 0.55);
              },
              yPercent: (_i, el) => {
                const index = charList.indexOf(el as HTMLElement);
                return exitVector(index).y;
              },
              rotate: (_i, el) => {
                const index = charList.indexOf(el as HTMLElement);
                return exitVector(index).rotate;
              },
              opacity: 0,
              ease: "none",
              stagger: {
                each: 0.04,
                from: "start",
              },
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        },
      });

      intro
        .to(chars, {
          yPercent: 0,
          duration: isDesktop ? 0.95 : 0.7,
          stagger: 0.02,
        })
        .to(
          meta,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
          },
          "-=0.45",
        );
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion, isDesktop]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[min(100dvh,920px)] flex-col justify-end overflow-x-clip pb-16 pt-10 lg:min-h-[calc(100dvh-var(--header-height))] lg:pb-20 lg:pt-16"
      aria-label="Introduction"
    >
      <Container className="relative min-w-0">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="min-w-0 lg:col-span-9">
            <p
              data-hero-meta
              className="text-label text-muted mb-8 max-w-full lg:mb-12"
            >
              {homeCopy.heroLabel}
              <span className="mx-3 text-ink-subtle" aria-hidden>
                /
              </span>
              <span className="inline">{site.role}</span>
            </p>

            <h1 ref={titleRef} className="text-display hero-display">
              {lines.map(({ line, chars }) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  {chars.map(({ char, key }) => (
                    <span
                      key={key}
                      data-hero-char
                      className="inline-block will-change-transform"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
          </div>

          <div className="flex min-w-0 flex-col gap-8 lg:col-span-3 lg:items-end lg:pb-3">
            <p
              data-hero-meta
              className="max-w-sm text-ink-muted lg:text-right lg:text-[length:var(--text-body)]"
            >
              {homeCopy.heroSupport}
            </p>
            <div
              data-hero-meta
              className="flex flex-wrap items-center gap-3 lg:justify-end"
            >
              <ButtonLink href="/#work" variant="solid">
                View work
              </ButtonLink>
              <ButtonLink href="/#contact" variant="line">
                Contact
              </ButtonLink>
              <CvActions variant="hero" />
            </div>
          </div>
        </div>

        <div
          data-hero-meta
          className="mt-16 hidden items-center justify-between border-t border-line pt-6 lg:flex"
        >
          <p className="text-label text-muted">Scroll</p>
        </div>
      </Container>
    </section>
  );
}
