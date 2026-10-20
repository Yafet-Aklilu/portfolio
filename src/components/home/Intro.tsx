"use client";

import { useRef } from "react";
import { Container } from "@/components/layout/Container";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { homeCopy } from "@/lib/content";
import { getGsap } from "@/lib/gsap";

export function Intro() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      const reveal = root.querySelectorAll<HTMLElement>("[data-reveal]");
      gsap.from(reveal, {
        y: isDesktop ? 40 : 24,
        opacity: 0,
        duration: isDesktop ? 0.9 : 0.65,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          once: true,
        },
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion, isDesktop]);

  return (
    <section
      ref={rootRef}
      id="intro"
      className="section-pad border-t border-line"
      aria-labelledby="intro-heading"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p data-reveal className="text-label text-muted">
              {homeCopy.introLabel}
            </p>
          </div>
          <div className="lg:col-span-8 lg:pl-8">
            <h2
              id="intro-heading"
              data-reveal
              className="text-headline max-w-[14ch]"
            >
              {homeCopy.introHeadline}
            </h2>
            <p
              data-reveal
              className="mt-8 max-w-2xl text-ink-muted lg:mt-10 lg:text-[length:var(--text-body-lg)]"
            >
              {homeCopy.introBody}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
