import { createClient } from "@/lib/supabase/server";
import type { Post, Category, Tag } from "@/lib/types";
import { Header } from "@/components/ui/Header";
import { PostCard } from "@/components/blog/PostCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Todas las publicaciones en orden cronológico",
};

export default async function TimelinePage() {
  const supabase = await createClient();

  // Fetch all public posts
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
    .order("published_at", { ascending: false });

  // Fetch categories for filters
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_private", false)
    .order("sort_order", { ascending: true });

  // Transform posts
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
      <main className="page-wrapper">
        <div className="container">
          <section className="timeline-header animate-fade-in">
            <h1>Timeline</h1>
            <p>
              Todas las publicaciones en orden cronológico, de lo más reciente a
              lo más antiguo.
            </p>
          </section>

          {/* Category filters */}
          {categories && categories.length > 0 && (
            <div className="timeline-filters">
              <Link href="/timeline" className="filter-chip active">
                Todas
              </Link>
              {categories.map((cat: Category) => (
                <Link
                  key={cat.id}
                  href={`/${cat.slug}`}
                  className="filter-chip"
                >
                  {cat.icon_emoji} {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Posts feed */}
          {transformedPosts.length > 0 ? (
            <div className="timeline-layout stagger-children">
              {transformedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-title">No hay publicaciones todavía</div>
              <p className="empty-state-text">
                Las publicaciones aparecerán aquí cuando se añadan los primeros artículos.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
