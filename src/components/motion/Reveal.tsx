"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { getGsap } from "@/lib/gsap";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "ul" | "li";
  y?: number;
  delay?: number;
};

export function Reveal({
  children,
  className,
  as: Tag = "div",
  y,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const { gsap, ScrollTrigger } = getGsap();
    const offset = y ?? (isDesktop ? 28 : 16);

    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: offset,
        opacity: 0,
        duration: isDesktop ? 0.8 : 0.55,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion, isDesktop, y, delay]);

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {children}
    </Tag>
  );
}
