import type { Metadata } from "next";
import { CategoryPage } from "@/components/work/CategoryPage";
import { getWorkCategory } from "@/lib/content";

const category = getWorkCategory("video")!;

export const metadata: Metadata = {
  title: category.title,
  description: category.description,
};

export default function VideoWorkPage() {
  return <CategoryPage category={category} />;
}
