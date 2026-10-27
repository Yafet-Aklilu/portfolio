import type { Metadata } from "next";
import { CategoryPage } from "@/components/work/CategoryPage";
import { getWorkCategory } from "@/lib/content";
import { getProjectsByCategory } from "@/lib/projects";

const category = getWorkCategory("software")!;

export const revalidate = 60;

export const metadata: Metadata = {
  title: category.title,
  description: category.description,
};

export default async function SoftwareWorkPage() {
  const projects = await getProjectsByCategory("software");
  return <CategoryPage category={category} projects={projects} />;
}
