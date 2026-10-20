import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageEnter } from "@/components/motion/PageEnter";
import { CategoryNav } from "@/components/work/CategoryNav";
import { site, workCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: `Selected work across software, UI/UX, graphic design, and video. ${site.name}.`,
};

export default function WorkIndexPage() {
  return (
    <PageEnter>
      <div className="section-pad pt-10 lg:pt-14">
        <Container>
          <CategoryNav />

          <header className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="text-label text-muted">Archive</p>
              <h1 className="text-headline mt-5 max-w-[12ch]">Selected work</h1>
            </div>
            <p className="max-w-md text-ink-muted lg:col-span-4 lg:justify-self-end lg:pt-12 lg:text-right lg:text-[length:var(--text-body-lg)]">
              Four lanes, one practice: full stack software with interface,
              graphic, and motion craft.
            </p>
          </header>

          <ul className="mt-16 divide-y divide-line border-y border-line">
            {workCategories.map((category, index) => (
              <li key={category.id}>
                <Link
                  href={category.href}
                  className="group grid gap-4 py-8 transition-opacity hover:opacity-55 lg:grid-cols-12 lg:items-end lg:gap-8 lg:py-12"
                >
                  <p className="text-label text-muted lg:col-span-1">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="lg:col-span-7">
                    <p className="text-label text-muted">{category.label}</p>
                    <h2 className="text-title mt-3 text-3xl md:text-4xl lg:text-5xl">
                      {category.title}
                    </h2>
                  </div>
                  <div className="flex items-end justify-between gap-4 lg:col-span-4 lg:justify-end">
                    <p className="max-w-sm text-sm text-ink-muted lg:text-right">
                      {category.description}
                    </p>
                    <span className="text-label shrink-0 text-muted">→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </PageEnter>
  );
}
