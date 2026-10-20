"use client";

import { useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { disciplines, homeCopy, type Discipline } from "@/lib/content";
import { cn } from "@/lib/cn";
import { getGsap } from "@/lib/gsap";

export function Disciplines() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<Discipline["id"]>(disciplines[0].id);
  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const active =
    disciplines.find((item) => item.id === activeId) ?? disciplines[0];

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion || !isDesktop) return;

    const { gsap, ScrollTrigger } = getGsap();
    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      disciplines.forEach((item) => {
        const el = root.querySelector<HTMLElement>(
          `[data-discipline="${item.id}"]`,
        );
        if (!el) return;

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => setActiveId(item.id),
          onEnterBack: () => setActiveId(item.id),
        });
        triggers.push(trigger);
      });
    }, root);

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      ctx.revert();
    };
  }, [reducedMotion, isDesktop]);

  return (
    <section
      ref={rootRef}
      id="practice"
      className="section-pad border-t border-line"
      aria-labelledby="practice-heading"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <p className="text-label text-muted">{homeCopy.disciplinesLabel}</p>
            <h2 id="practice-heading" className="text-headline mt-5 max-w-[12ch]">
              {homeCopy.disciplinesHeadline}
            </h2>
            <p
              key={active.id}
              className="mt-8 max-w-sm text-ink-muted transition-opacity lg:mt-10 lg:text-[length:var(--text-body-lg)]"
            >
              {active.summary}
            </p>
          </div>

          <ul className="lg:col-span-7 lg:col-start-6">
            {disciplines.map((item) => {
              const isActive = item.id === activeId;
              return (
                <li
                  key={item.id}
                  data-discipline={item.id}
                  className="border-t border-line last:border-b"
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    onMouseEnter={() => {
                      if (isDesktop) setActiveId(item.id);
                    }}
                    className="flex w-full items-baseline justify-between gap-6 py-7 text-left lg:py-10"
                    aria-pressed={isActive}
                  >
                    <span
                      className={cn(
                        "font-display text-3xl font-bold uppercase tracking-tight transition-colors duration-300 md:text-5xl lg:text-6xl xl:text-7xl",
                        isActive ? "text-ink" : "text-ink/35",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "text-label shrink-0 transition-colors duration-300",
                        isActive ? "text-ink" : "text-ink-subtle",
                      )}
                    >
                      {isActive ? "Active" : "Select"}
                    </span>
                  </button>
                  {!isDesktop && isActive ? (
                    <p className="pb-8 text-ink-muted">{item.summary}</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
