import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { site, workCategories } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-invert-bg text-invert-ink">
      <Container className="section-pad grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="text-label text-invert-ink/50">Contact</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 block font-display text-2xl font-bold uppercase tracking-tight md:text-3xl lg:text-4xl"
          >
            {site.email}
          </a>
          <ul className="mt-8 flex flex-wrap gap-6">
            {site.socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-label text-invert-ink/70 transition-colors hover:text-invert-ink"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3 lg:col-start-7">
          <p className="text-label text-invert-ink/50">Work</p>
          <ul className="mt-4 space-y-3">
            {workCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={category.href}
                  className="text-label text-invert-ink/80 transition-colors hover:text-invert-ink"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="text-label text-invert-ink/50">Navigate</p>
          <ul className="mt-4 space-y-3">
            <li>
              <Link
                href="/"
                className="text-label text-invert-ink transition-opacity hover:opacity-70"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/work"
                className="text-label text-invert-ink/80 transition-colors hover:text-invert-ink"
              >
                All work
              </Link>
            </li>
            <li>
              <Link
                href="/#contact"
                className="text-label text-invert-ink/80 transition-colors hover:text-invert-ink"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <Container className="border-t border-white/10 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="font-display text-3xl font-bold uppercase tracking-tight md:text-5xl lg:text-6xl">
            {site.name}
          </p>
          <p className="text-label text-invert-ink/45">
            © {new Date().getFullYear()}
          </p>
        </div>
      </Container>
    </footer>
  );
}
