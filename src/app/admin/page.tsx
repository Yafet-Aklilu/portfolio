import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { Container } from "@/components/layout/Container";
import { getProjectCover, type Project } from "@/lib/content";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllProjectsAdmin } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  let projects: Project[] = [];
  let loadError: string | null = null;
  try {
    projects = await getAllProjectsAdmin();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Failed to load projects.";
  }

  return (
    <main className="section-pad">
      <Container>
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-label text-muted">Admin</p>
            <h1 className="text-title mt-3 text-3xl sm:text-4xl">Projects</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="btn btn-line">
              View site
            </Link>
            <LogoutButton />
            <Link href="/admin/projects/new" className="btn btn-solid">
              Add project
            </Link>
          </div>
        </header>

        {loadError ? (
          <p className="mt-10 border border-line bg-bg-elevated px-4 py-3 text-sm">
            {loadError}. Set SUPABASE_SERVICE_ROLE_KEY and ADMIN_PASSWORD in
            env.
          </p>
        ) : null}

        <ul className="mt-12 divide-y divide-line border-y border-line">
          {projects.map((project) => {
            const cover = getProjectCover(project);
            return (
              <li
                key={project.id}
                className="flex flex-wrap items-center gap-4 py-5"
              >
                {cover?.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover.src}
                    alt=""
                    className="h-14 w-14 border border-line object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center border border-line text-label text-muted">
                    —
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-bold uppercase tracking-tight">
                    {project.name}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {project.categories.join(", ")}
                    {project.draft ? " · draft" : ""}
                    {project.featured ? " · featured" : ""}
                  </p>
                </div>
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="btn btn-line !px-3 !py-2"
                >
                  Edit
                </Link>
              </li>
            );
          })}
        </ul>

        {projects.length === 0 && !loadError ? (
          <p className="mt-8 text-ink-muted">No projects yet.</p>
        ) : null}
      </Container>
    </main>
  );
}
