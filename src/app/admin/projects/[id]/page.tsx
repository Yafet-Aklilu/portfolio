import { notFound, redirect } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { Container } from "@/components/layout/Container";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProjectByIdAdmin } from "@/lib/projects";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProjectPage({ params }: PageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const project = await getProjectByIdAdmin(id);
  if (!project) notFound();

  return (
    <main className="section-pad">
      <Container>
        <ProjectForm mode="edit" initial={project} />
      </Container>
    </main>
  );
}
