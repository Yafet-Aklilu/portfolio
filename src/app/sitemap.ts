import type { MetadataRoute } from "next";
import { site, workCategories } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${base}/work`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...workCategories.map((category) => ({
      url: `${base}${category.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
