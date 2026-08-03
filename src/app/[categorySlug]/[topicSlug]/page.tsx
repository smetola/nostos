import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/ui/Header";
import { PostCard } from "@/components/blog/PostCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Post, Category, Tag } from "@/lib/types";

interface Props {
  params: Promise<{ categorySlug: string; topicSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, topicSlug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id, name")
    .eq("slug", categorySlug)
    .single();
  if (!category) return { title: "No encontrado" };

  const { data: topic } = await supabase
    .from("topics")
    .select("name, description")
    .eq("slug", topicSlug)
    .eq("category_id", category.id)
    .single();
  if (!topic) return { title: "No encontrado" };

  return {
    title: `${topic.name} — ${category.name}`,
    description: topic.description || `Apuntes sobre ${topic.name}`,
  };
}

export default async function TopicPage({ params }: Props) {
  const { categorySlug, topicSlug } = await params;
  const supabase = await createClient();

  // Fetch category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", categorySlug)
    .single();
  if (!category) notFound();

  // Fetch topic
  const { data: topic } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", topicSlug)
    .eq("category_id", category.id)
    .single();
  if (!topic) notFound();

  // Fetch posts in this topic
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
    .eq("topic_id", topic.id)
    .eq("is_private", false)
    .order("published_at", { ascending: false });

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
        <div className="container" style={{ maxWidth: "720px" }}>
          {/* Breadcrumb */}
          <nav className="article-breadcrumb animate-fade-in">
            <Link href="/">Inicio</Link>
            <span className="separator">›</span>
            <Link href={`/${categorySlug}`}>{category.name}</Link>
            <span className="separator">›</span>
            <span>{topic.name}</span>
          </nav>

          {/* Topic header */}
          <div
            className="animate-slide-up"
            style={{ marginBottom: "var(--space-8)" }}
          >
            <h1 style={{ marginBottom: "var(--space-3)" }}>{topic.name}</h1>
            {topic.description && (
              <p
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--text-muted)",
                }}
              >
                {topic.description}
              </p>
            )}
          </div>

          {/* Posts */}
          {transformedPosts.length > 0 ? (
            <div className="timeline-layout stagger-children">
              {transformedPosts.map((post) => (
                <PostCard key={post.id} post={post} showCategory={false} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-title">Sin apuntes aún</div>
              <p className="empty-state-text">
                Este tema todavía no tiene publicaciones.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
