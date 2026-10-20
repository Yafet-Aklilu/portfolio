"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/layout/Container";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { homeCopy, site } from "@/lib/content";
import { getGsap } from "@/lib/gsap";

export function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-contact-reveal]"), {
        y: isDesktop ? 32 : 18,
        opacity: 0,
        duration: 0.85,
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
      id="contact"
      className="section-pad border-t border-line"
      aria-labelledby="contact-heading"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p data-contact-reveal className="text-label text-muted">
              {homeCopy.contactLabel}
            </p>
            <h2
              id="contact-heading"
              data-contact-reveal
              className="text-headline mt-5 max-w-[12ch]"
            >
              {homeCopy.contactHeadline}
            </h2>
            <p
              data-contact-reveal
              className="mt-8 max-w-md text-ink-muted lg:text-[length:var(--text-body-lg)]"
            >
              {homeCopy.contactBody}
            </p>
          </div>

          <div className="flex flex-col justify-end gap-10 lg:col-span-6 lg:col-start-7">
            <a
              data-contact-reveal
              href={`mailto:${site.email}`}
              className="font-display text-3xl font-bold uppercase tracking-tight transition-opacity hover:opacity-55 md:text-5xl lg:text-6xl"
            >
              {site.email}
            </a>

            <div
              data-contact-reveal
              className="flex flex-wrap items-center gap-3"
            >
              <ButtonLink href={`mailto:${site.email}`} variant="solid" external>
                Email me
              </ButtonLink>
              {site.socials.map((social) => (
                <ButtonLink
                  key={social.id}
                  href={social.href}
                  variant="line"
                  external
                >
                  {social.label}
                </ButtonLink>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
