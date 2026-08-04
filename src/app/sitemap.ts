import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nostos.vercel.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/timeline`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Dynamic category pages
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, updated_at")
    .eq("is_private", false);

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map(
    (cat) => ({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: new Date(cat.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // Dynamic topic pages
  const { data: topics } = await supabase
    .from("topics")
    .select("slug, updated_at, category:categories!inner(slug)")
    .eq("is_private", false);

  const topicPages: MetadataRoute.Sitemap = (topics ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (topic: any) => ({
      url: `${baseUrl}/${topic.category.slug}/${topic.slug}`,
      lastModified: new Date(topic.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  // Dynamic post pages
  const { data: posts } = await supabase
    .from("posts")
    .select(
      "slug, updated_at, topic:topics!inner(slug, category:categories!inner(slug))"
    )
    .eq("is_private", false);

  const postPages: MetadataRoute.Sitemap = (posts ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (post: any) => ({
      url: `${baseUrl}/${post.topic.category.slug}/${post.topic.slug}/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...categoryPages, ...topicPages, ...postPages];
}
