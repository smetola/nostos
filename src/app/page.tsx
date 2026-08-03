import { createClient } from "@/lib/supabase/server";
import type { Post, Category, Tag } from "@/lib/types";
import { Header } from "@/components/ui/Header";
import { PostCard } from "@/components/blog/PostCard";
import { CategoryCard } from "@/components/blog/CategoryCard";
import Link from "next/link";

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

  // Fetch public categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*, topics(count)")
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
      <main className="page-wrapper">
        <div className="container">
          {/* Hero Section */}
          <section className="timeline-header animate-fade-in">
            <h1>Nostos</h1>
            <p>
              Investigaciones, reflexiones y apuntes personales. Un jardín
              digital donde explorar ideas.
            </p>
          </section>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <section style={{ marginBottom: "var(--space-12)" }}>
              <h2
                style={{
                  marginBottom: "var(--space-5)",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: "var(--text-sm)",
                }}
              >
                Explorar categorías
              </h2>
              <div className="category-grid stagger-children">
                {categories.map((cat: Category & { topics: { count: number }[] }) => (
                  <CategoryCard key={cat.id} category={cat} />
                ))}
              </div>
            </section>
          )}

          {/* Latest Posts */}
          <section>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "var(--space-5)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                }}
              >
                Últimas publicaciones
              </h2>
              <Link href="/timeline" className="nav-link">
                Ver todo →
              </Link>
            </div>

            {transformedPosts.length > 0 ? (
              <div className="timeline-layout stagger-children">
                {transformedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <div className="empty-state-title">
                  Aún no hay publicaciones
                </div>
                <p className="empty-state-text">
                  Las primeras reflexiones aparecerán aquí pronto.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
