import { createClient } from "@/lib/supabase/server";
import type { Post, Category, Tag } from "@/lib/types";
import { Header } from "@/components/ui/Header";
import { HomeContent } from "@/components/HomeContent";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch latest public posts with their relations
  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      topic:topics!inner(
        *,
        category:categories!inner(*)
      ),
      tags:post_tags(tag:tags(*))
    `
    )
    .eq("is_private", false)
    .order("published_at", { ascending: false })
    .limit(10);

  // Fetch public categories with topic counts (for feed view)
  const { data: categories } = await supabase
    .from("categories")
    .select("*, topics(count)")
    .eq("is_private", false)
    .order("sort_order", { ascending: true });

  // Fetch categories with full topics (for map view)
  const { data: categoriesWithTopics } = await supabase
    .from("categories")
    .select("*, topics(*)")
    .eq("is_private", false)
    .order("sort_order", { ascending: true });

  // Transform posts to flatten tag structure
  const transformedPosts: (Post & { topic: { category: Category }; tags: Tag[] })[] =
    (posts ?? []).map((post: Record<string, unknown>) => ({
      ...post,
      tags: ((post.tags as { tag: Tag }[]) ?? []).map(
        (pt: { tag: Tag }) => pt.tag
      ),
    })) as (Post & { topic: { category: Category }; tags: Tag[] })[];

  return (
    <>
      <Header />
      <HomeContent
        posts={transformedPosts}
        categories={categories ?? []}
        categoriesWithTopics={categoriesWithTopics ?? []}
      />
    </>
  );
}
