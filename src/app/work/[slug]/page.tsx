import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/layout/Container";
import { PageEnter } from "@/components/motion/PageEnter";
import {
  findTechMark,
  getProjectBySlug,
  getPublishedProjects,
  getWorkCategory,
} from "@/lib/content";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return getPublishedProjects()
    .filter((project) => project.presentation === "page")
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Case study" };
  return {
    title: project.name,
    description: project.summary,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.presentation !== "page") {
    notFound();
  }

  const primaryCategoryId = project.categories[0] ?? "software";
  const primaryCategory = getWorkCategory(primaryCategoryId);

  return (
    <PageEnter>
      <article className="section-pad pt-10 lg:pt-14">
        <Container>
          <p className="text-label text-muted">
            <Link href="/work" className="transition-opacity hover:opacity-55">
              Work
            </Link>
            <span className="mx-2 text-ink-subtle">/</span>
            <Link
              href={primaryCategory?.href ?? "/work/software"}
              className="transition-opacity hover:opacity-55"
            >
              {primaryCategory?.label ?? primaryCategoryId}
            </Link>
          </p>

          <header className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <p className="text-label text-muted">
                {project.role} · {project.year}
              </p>
              <h1 className="text-headline mt-5">{project.name}</h1>
              <p className="mt-8 max-w-2xl text-ink-muted lg:text-[length:var(--text-body-lg)]">
                {project.summary}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.liveUrl ? (
                  <ButtonLink href={project.liveUrl} variant="solid" external>
                    Live site
                  </ButtonLink>
                ) : null}
                {project.githubUrl ? (
                  <ButtonLink href={project.githubUrl} variant="line" external>
                    GitHub
                  </ButtonLink>
                ) : null}
              </div>
            </div>
            <aside className="border border-line bg-bg-elevated p-6 lg:col-span-4 lg:self-start">
              <p className="text-label text-muted">Case study</p>
              <p className="mt-4 text-sm text-ink-muted">
                A deeper look at the problem, process, and outcome, with room
                for process frames and project stills.
              </p>
            </aside>
          </header>

          {project.technologies.length > 0 ? (
            <section className="mt-16 border-t border-line pt-10">
              <p className="text-label text-muted">Technologies</p>
              <ul className="mt-4 flex flex-wrap gap-3">
                {project.technologies.map((tech) => {
                  const mark = findTechMark(tech);
                  return (
                    <li
                      key={tech}
                      className="flex items-center gap-2 border border-line bg-bg-elevated px-3 py-2"
                    >
                      {mark ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mark.logoSrc}
                          alt=""
                          width={18}
                          height={18}
                          className="h-[18px] w-[18px] opacity-80"
                        />
                      ) : null}
                      <span className="text-label">{tech}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {project.images.length > 0 ? (
            <section className="mt-16 space-y-6">
              {project.images.map((image) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  className="w-full border border-line bg-bg-elevated"
                />
              ))}
            </section>
          ) : (
            <section className="mt-16 grid gap-4 border-t border-line pt-10 lg:grid-cols-2">
              <div className="aspect-[16/10] border border-line bg-bg-elevated p-5">
                <p className="text-label text-muted">01 · Cover</p>
                <p className="mt-3 text-sm text-ink-muted">
                  Primary still reserved for project imagery.
                </p>
              </div>
              <div className="aspect-[16/10] border border-line bg-bg-elevated p-5">
                <p className="text-label text-muted">02 · Detail</p>
                <p className="mt-3 text-sm text-ink-muted">
                  Secondary frame for UI or process.
                </p>
              </div>
            </section>
          )}

          {(project.problem || project.approach || project.outcome) && (
            <section className="mt-16 grid gap-12 border-t border-line pt-12 lg:grid-cols-3">
              {project.problem ? (
                <div>
                  <p className="text-label text-muted">Problem</p>
                  <p className="mt-4 text-ink-muted">{project.problem}</p>
                </div>
              ) : null}
              {project.approach ? (
                <div>
                  <p className="text-label text-muted">Approach</p>
                  <p className="mt-4 text-ink-muted">{project.approach}</p>
                </div>
              ) : null}
              {project.outcome ? (
                <div>
                  <p className="text-label text-muted">Outcome</p>
                  <p className="mt-4 text-ink-muted">{project.outcome}</p>
                </div>
              ) : null}
            </section>
          )}
        </Container>
      </article>
    </PageEnter>
  );
}
