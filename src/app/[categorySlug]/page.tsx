import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/ui/Header";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Topic } from "@/lib/types";

interface Props {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", categorySlug)
    .single();

  if (!category) return { title: "Categoría no encontrada" };

  return {
    title: category.name,
    description: category.description || `Explora los temas de ${category.name}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", categorySlug)
    .single();

  if (!category) notFound();

  const { data: topics } = await supabase
    .from("topics")
    .select("*, posts:posts(count)")
    .eq("category_id", category.id)
    .eq("is_private", false)
    .order("sort_order", { ascending: true });

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="container" style={{ maxWidth: "720px" }}>
          {/* Breadcrumb */}
          <nav className="article-breadcrumb animate-fade-in">
            <Link href="/">Inicio</Link>
            <span className="separator">›</span>
            <span>{category.name}</span>
          </nav>

          {/* Category header */}
          <div
            className="animate-slide-up"
            style={{ marginBottom: "var(--space-8)" }}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "var(--space-3)",
              }}
            >
              {category.icon_emoji}
            </div>
            <h1
              style={{
                color: category.color_hex,
                marginBottom: "var(--space-3)",
              }}
            >
              {category.name}
            </h1>
            {category.description && (
              <p
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--text-muted)",
                }}
              >
                {category.description}
              </p>
            )}
          </div>

          {/* Topics list */}
          {topics && topics.length > 0 ? (
            <div className="topic-list stagger-children">
              {topics.map((topic: Topic & { posts: { count: number }[] }) => {
                const postCount = topic.posts?.[0]?.count ?? 0;
                return (
                  <Link
                    key={topic.id}
                    href={`/${categorySlug}/${topic.slug}`}
                    className="topic-item"
                    id={`topic-${topic.slug}`}
                  >
                    <span className="topic-item-name">{topic.name}</span>
                    <span className="topic-item-count">
                      {postCount} {postCount === 1 ? "apunte" : "apuntes"}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📂</div>
              <div className="empty-state-title">Sin temas aún</div>
              <p className="empty-state-text">
                Esta categoría todavía no tiene temas.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
