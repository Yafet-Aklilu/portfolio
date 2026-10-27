import { CvActions } from "@/components/cv/CvActions";
import { Container } from "@/components/layout/Container";
import { PageEnter } from "@/components/motion/PageEnter";
import { CategoryNav } from "@/components/work/CategoryNav";
import { CategoryProjectList } from "@/components/work/CategoryProjectList";
import {
  getCvForCategory,
  type Project,
  type WorkCategory,
} from "@/lib/content";

export function CategoryPage({
  category,
  projects,
}: {
  category: WorkCategory;
  projects: Project[];
}) {
  const cv = getCvForCategory(category.id);

  return (
    <PageEnter>
      <div className="section-pad pt-10 lg:pt-14">
        <Container>
          <CategoryNav active={category.id} />

          <header className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <p className="text-label text-muted">Work</p>
              <h1 className="text-headline mt-5 max-w-[16ch]">
                {category.title}
              </h1>
              {cv ? (
                <div className="mt-8">
                  <CvActions cv={cv} variant="page" />
                </div>
              ) : null}
            </div>
            <p className="max-w-md text-ink-muted lg:col-span-4 lg:justify-self-end lg:pt-12 lg:text-right lg:text-[length:var(--text-body-lg)]">
              {category.description}
            </p>
          </header>

          <div className="mt-12 lg:mt-16">
            <CategoryProjectList category={category} projects={projects} />
          </div>
        </Container>
      </div>
    </PageEnter>
  );
}
