import { redirect } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { Container } from "@/components/layout/Container";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminNewProjectPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <main className="section-pad">
      <Container>
        <ProjectForm mode="create" />
      </Container>
    </main>
  );
}
