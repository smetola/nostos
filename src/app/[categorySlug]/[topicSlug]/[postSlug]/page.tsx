import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/ui/Header";
import { TagBadge } from "@/components/blog/TagBadge";
import { CategoryPill } from "@/components/blog/CategoryPill";
import { formatDateFull } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Tag } from "@/lib/types";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";

interface Props {
  params: Promise<{
    categorySlug: string;
    topicSlug: string;
    postSlug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postSlug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, content_md")
    .eq("slug", postSlug)
    .single();

  if (!post) return { title: "No encontrado" };

  return {
    title: post.title,
    description:
      post.excerpt || post.content_md?.substring(0, 160) || post.title,
  };
}

export default async function PostPage({ params }: Props) {
  const { categorySlug, topicSlug, postSlug } = await params;
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

  // Fetch post with tags
  const { data: post } = await supabase
    .from("posts")
    .select(
      `
      *,
      tags:post_tags(tag:tags(*))
    `
    )
    .eq("slug", postSlug)
    .eq("topic_id", topic.id)
    .single();
  if (!post) notFound();

  // Transform tags
  const tags: Tag[] = (
    (post.tags as { tag: Tag }[]) ?? []
  ).map((pt: { tag: Tag }) => pt.tag);

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <article className="article-container animate-slide-up">
          {/* Header */}
          <header className="article-header">
            {/* Breadcrumb */}
            <nav className="article-breadcrumb">
              <Link href="/">Inicio</Link>
              <span className="separator">›</span>
              <Link href={`/${categorySlug}`}>{category.name}</Link>
              <span className="separator">›</span>
              <Link href={`/${categorySlug}/${topicSlug}`}>{topic.name}</Link>
            </nav>

            {/* Meta */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                marginBottom: "var(--space-4)",
                flexWrap: "wrap",
              }}
            >
              <time
                dateTime={post.published_at}
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-muted)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatDateFull(post.published_at)}
              </time>
              <CategoryPill category={category} />
              {post.is_private && (
                <span className="private-badge">🔒 Privado</span>
              )}
            </div>

            <h1>{post.title}</h1>

            {/* Tags */}
            {tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-2)",
                  marginTop: "var(--space-4)",
                }}
              >
                {tags.map((tag) => (
                  <TagBadge key={tag.id} tag={tag} linked />
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose">
            <MarkdownRenderer content={post.content_md} />
          </div>

          {/* Back link */}
          <div
            style={{
              marginTop: "var(--space-12)",
              paddingTop: "var(--space-6)",
              borderTop: "1px solid var(--glass-border)",
            }}
          >
            <Link
              href={`/${categorySlug}/${topicSlug}`}
              className="btn btn-ghost"
            >
              ← Volver a {topic.name}
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
