"use client";

import { useState } from "react";
import { InfiniteCanvas } from "@/components/map/InfiniteCanvas";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { PostCard } from "@/components/blog/PostCard";
import { CategoryCard } from "@/components/blog/CategoryCard";
import Link from "next/link";
import type { Post, Category, Tag, Topic } from "@/lib/types";

interface CategoryWithMeta extends Category {
  topics: { count: number }[];
}

interface CategoryWithTopics extends Category {
  topics: Topic[];
}

interface HomeContentProps {
  posts: (Post & { topic: { category: Category }; tags: Tag[] })[];
  categories: CategoryWithMeta[];
  categoriesWithTopics: CategoryWithTopics[];
}

export function HomeContent({
  posts,
  categories,
  categoriesWithTopics,
}: HomeContentProps) {
  const [view, setView] = useState<"feed" | "map">("feed");

  return (
    <>
      {view === "map" ? (
        /* ===== MAP VIEW ===== */
        <InfiniteCanvas categories={categoriesWithTopics} />
      ) : (
        /* ===== FEED VIEW ===== */
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
                  {categories.map((cat) => (
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

              {posts.length > 0 ? (
                <div className="timeline-layout stagger-children">
                  {posts.map((post) => (
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
      )}

      {/* View Toggle — always visible */}
      <ViewToggle activeView={view} onToggle={setView} />
    </>
  );
}
