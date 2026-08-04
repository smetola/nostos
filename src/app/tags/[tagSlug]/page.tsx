import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/ui/Header";
import { PostCard } from "@/components/blog/PostCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Post, Category, Tag } from "@/lib/types";

interface Props {
  params: Promise<{ tagSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tagSlug } = await params;
  const supabase = await createClient();

  const { data: tag } = await supabase
    .from("tags")
    .select("name")
    .eq("slug", tagSlug)
    .single();

  if (!tag) return { title: "Etiqueta no encontrada" };

  return {
    title: `#${tag.name}`,
    description: `Todos los apuntes etiquetados con #${tag.name}`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tagSlug } = await params;
  const supabase = await createClient();

  // Fetch tag
  const { data: tag } = await supabase
    .from("tags")
    .select("*")
    .eq("slug", tagSlug)
    .single();

  if (!tag) notFound();

  // Fetch posts with this tag
  const { data: postTags } = await supabase
    .from("post_tags")
    .select("post_id")
    .eq("tag_id", tag.id);

  const postIds = (postTags ?? []).map((pt: { post_id: string }) => pt.post_id);

  let posts: (Post & { topic: { category: Category }; tags: Tag[] })[] = [];

  if (postIds.length > 0) {
    const { data: rawPosts } = await supabase
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
      .in("id", postIds)
      .eq("is_private", false)
      .order("published_at", { ascending: false });

    posts = (rawPosts ?? []).map((post: Record<string, unknown>) => ({
      ...post,
      tags: ((post.tags as { tag: Tag }[]) ?? []).map(
        (pt: { tag: Tag }) => pt.tag
      ),
    })) as (Post & { topic: { category: Category }; tags: Tag[] })[];
  }

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="container" style={{ maxWidth: "720px" }}>
          {/* Tag header */}
          <div
            className="animate-slide-up"
            style={{
              textAlign: "center",
              marginBottom: "var(--space-8)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-5)",
                background: `${tag.color_hex || "#8b5cf6"}18`,
                border: `1px solid ${tag.color_hex || "#8b5cf6"}30`,
                borderRadius: "var(--radius-full)",
                color: tag.color_hex || "#8b5cf6",
                fontSize: "var(--text-xl)",
                fontWeight: 600,
                marginBottom: "var(--space-4)",
              }}
            >
              #{tag.name}
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "var(--text-base)",
              }}
            >
              {posts.length} {posts.length === 1 ? "apunte" : "apuntes"} con
              esta etiqueta
            </p>
          </div>

          {/* Posts */}
          {posts.length > 0 ? (
            <div className="timeline-layout stagger-children">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔖</div>
              <div className="empty-state-title">Sin apuntes</div>
              <p className="empty-state-text">
                Aún no hay publicaciones con esta etiqueta.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
