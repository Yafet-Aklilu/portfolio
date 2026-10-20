"use client";

import { useRef } from "react";
import { Container } from "@/components/layout/Container";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { homeCopy, techStrip } from "@/lib/content";
import { getGsap, gsap } from "@/lib/gsap";

type MarqueeTween = ReturnType<typeof gsap.to>;

function TechItem({
  name,
  logoSrc,
  hidden,
}: {
  name: string;
  logoSrc: string;
  hidden?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-3 text-ink"
      aria-hidden={hidden}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt=""
        width={32}
        height={32}
        className="h-7 w-7 opacity-80 lg:h-8 lg:w-8"
      />
      <span className="text-label whitespace-nowrap">{name}</span>
    </div>
  );
}

export function TechStrip() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<MarqueeTween | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    if (reducedMotion) {
      track.style.transform = "";
      return;
    }

    const { gsap } = getGsap();

    const setup = () => {
      tweenRef.current?.kill();
      gsap.set(track, { x: 0 });

      const sequence = track.querySelector<HTMLElement>("[data-marquee-set]");
      const distance = sequence?.offsetWidth ?? track.scrollWidth / 2;
      if (distance <= 0) return;

      const pixelsPerSecond = window.matchMedia("(min-width: 1024px)").matches
        ? 42
        : 28;

      tweenRef.current = gsap.to(track, {
        x: -distance,
        duration: distance / pixelsPerSecond,
        ease: "none",
        repeat: -1,
      });
    };

    setup();

    const onEnter = () => tweenRef.current?.pause();
    const onLeave = () => tweenRef.current?.resume();
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);

    const onResize = () => setup();
    window.addEventListener("resize", onResize);

    return () => {
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      className="max-w-[100vw] overflow-hidden border-y border-line bg-bg-elevated py-10 lg:py-14"
      aria-label={homeCopy.techLabel}
    >
      <Container className="mb-8">
        <p className="text-label text-muted">{homeCopy.techLabel}</p>
      </Container>

      <div className="marquee-viewport relative">
        <div
          ref={trackRef}
          className="flex w-max items-center will-change-transform"
        >
          <div
            data-marquee-set
            className="flex items-center gap-10 px-[var(--gutter)] sm:gap-12 md:gap-16 lg:gap-20"
          >
            {techStrip.map((item) => (
              <TechItem key={`a-${item.id}`} {...item} />
            ))}
          </div>
          <div
            className="flex items-center gap-10 px-[var(--gutter)] sm:gap-12 md:gap-16 lg:gap-20"
            aria-hidden
          >
            {techStrip.map((item) => (
              <TechItem key={`b-${item.id}`} {...item} hidden />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
