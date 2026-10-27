import { Contact } from "@/components/home/Contact";
import { Disciplines } from "@/components/home/Disciplines";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { SelectedWork } from "@/components/home/SelectedWork";
import { TechStrip } from "@/components/home/TechStrip";
import { getPublishedProjects } from "@/lib/projects";

export const revalidate = 60;

export default async function HomePage() {
  const projects = await getPublishedProjects();
  const featured = projects.filter((project) => project.featured);

  return (
    <>
      <Hero />
      <Intro />
      <TechStrip />
      <SelectedWork featured={featured} />
      <Disciplines />
      <Contact />
    </>
  );
}
