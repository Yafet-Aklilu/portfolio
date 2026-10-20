"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { navLinks, site, workCategories } from "@/lib/content";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-sm">
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-8">
        <Link
          href="/"
          className="group flex items-baseline gap-3"
          aria-label={`${site.name} home`}
        >
          <span className="font-display text-xl font-bold uppercase tracking-tight text-ink md:text-2xl">
            {site.monogram}
          </span>
          <span className="text-label hidden text-ink-muted transition-colors group-hover:text-ink sm:inline">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const active =
                link.href === "/work"
                  ? pathname.startsWith("/work")
                  : pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-label transition-opacity hover:opacity-55",
                      active ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="text-label text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </Container>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-line bg-bg md:hidden"
        >
          <Container className="flex max-w-full flex-col gap-8 overflow-x-clip py-8">
            <ul className="space-y-5">
              <li>
                <Link
                  href="/"
                  className="font-display text-3xl font-bold uppercase tracking-tight"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
              </li>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-display text-3xl font-bold uppercase tracking-tight"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <p className="text-label text-muted">Categories</p>
              <ul className="mt-4 space-y-3">
                {workCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={category.href}
                      className="text-label text-ink transition-opacity hover:opacity-55"
                      onClick={() => setOpen(false)}
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={`mailto:${site.email}`}
              className="text-label text-muted"
              onClick={() => setOpen(false)}
            >
              {site.email}
            </a>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
