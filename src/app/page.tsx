import { Contact } from "@/components/home/Contact";
import { Disciplines } from "@/components/home/Disciplines";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { SelectedWork } from "@/components/home/SelectedWork";
import { TechStrip } from "@/components/home/TechStrip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <TechStrip />
      <SelectedWork />
      <Disciplines />
      <Contact />
    </>
  );
}
