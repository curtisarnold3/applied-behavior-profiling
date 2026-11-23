import type { MetadataRoute } from "next";
import { units, weeks } from "@/content/course";
import { getLessons } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/", "/syllabus", "/practice", "/practice/log", "/tools", "/tools/profile-builder", "/tools/self-assessment",
    "/tools/limiting-beliefs", "/capstone", "/field-cards", "/progress", "/credits",
    ...units.map((u) => `/unit/${u.slug}`),
    ...weeks.map((w) => `/week/${w.number}`),
    ...getLessons().map((l) => `/lesson/${l.slug}`),
  ];
  return paths.map((p) => ({ url: `${site.url}${p === "/" ? "" : p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
