import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get counts
  const [
    { count: categoriesCount },
    { count: topicsCount },
    { count: postsCount },
    { count: tagsCount },
    { count: privatePostsCount },
  ] = await Promise.all([
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("topics").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("tags").select("*", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("is_private", true),
  ]);

  const stats = [
    { label: "Categorías", count: categoriesCount ?? 0, emoji: "📁", href: "/admin/categories" },
    { label: "Temas", count: topicsCount ?? 0, emoji: "🏷️", href: "/admin/topics" },
    { label: "Posts", count: postsCount ?? 0, emoji: "📝", href: "/admin/posts" },
    { label: "Tags", count: tagsCount ?? 0, emoji: "🔖", href: "/admin/tags" },
    { label: "Privados", count: privatePostsCount ?? 0, emoji: "🔒", href: "/admin/posts" },
  ];

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Panel de Control</h1>
        <Link href="/admin/posts/new" className="btn btn-primary">
          + Nuevo Post
        </Link>
      </div>

      {/* Stats grid */}
      <div
        className="stagger-children"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "var(--space-4)",
          marginBottom: "var(--space-8)",
        }}
      >
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass-card"
            style={{
              textAlign: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "var(--space-2)" }}>
              {stat.emoji}
            </div>
            <div
              style={{
                fontSize: "var(--text-3xl)",
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                color: "var(--text-primary)",
              }}
            >
              {stat.count}
            </div>
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
              }}
            >
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h3
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 600,
          fontFamily: "var(--font-body)",
          marginBottom: "var(--space-4)",
        }}
      >
        Acciones rápidas
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <Link href="/admin/posts/new" className="topic-item">
          <span className="topic-item-name">📝 Nuevo apunte</span>
          <span style={{ color: "var(--text-muted)" }}>→</span>
        </Link>
        <Link href="/admin/categories" className="topic-item">
          <span className="topic-item-name">📁 Gestionar categorías</span>
          <span style={{ color: "var(--text-muted)" }}>→</span>
        </Link>
        <Link href="/admin/tags" className="topic-item">
          <span className="topic-item-name">🔖 Gestionar etiquetas</span>
          <span style={{ color: "var(--text-muted)" }}>→</span>
        </Link>
      </div>
    </div>
  );
}
