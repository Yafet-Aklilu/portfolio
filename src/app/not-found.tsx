import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <div className="section-pad">
      <Container>
        <p className="text-label text-muted">404</p>
        <h1 className="text-headline mt-5 max-w-[12ch]">Page not found</h1>
        <p className="mt-8 max-w-md text-ink-muted lg:text-[length:var(--text-body-lg)]">
          That route is not part of this portfolio yet, or the case study has
          not been published.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="solid">
            Home
          </ButtonLink>
          <ButtonLink href="/work" variant="line">
            Work
          </ButtonLink>
          <Link
            href="/#contact"
            className="text-label inline-flex items-center px-2 py-3.5 text-muted transition-opacity hover:opacity-55"
          >
            Contact
          </Link>
        </div>
      </Container>
    </div>
  );
}
