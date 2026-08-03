import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/puerta");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/");

  return (
    <div className="admin-layout">
      {/* Top bar */}
      <header
        className="header"
        style={{
          borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
        }}
      >
        <div className="header-inner">
          <Link href="/admin" className="header-logo">
            <span>Nostos</span>
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--accent-violet)",
                background: "var(--accent-violet-dim)",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
              }}
            >
              ADMIN
            </span>
          </Link>
          <nav className="header-nav">
            <Link href="/" className="nav-link" style={{ fontSize: "var(--text-xs)" }}>
              Ver web →
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="admin-content" style={{ paddingTop: "calc(60px + var(--space-4))" }}>
        {children}
      </div>

      {/* Bottom navigation (mobile tabs) */}
      <nav className="admin-bottom-nav">
        <Link href="/admin" className="admin-tab">
          <span className="tab-icon">📊</span>
          <span>Panel</span>
        </Link>
        <Link href="/admin/posts" className="admin-tab">
          <span className="tab-icon">📝</span>
          <span>Posts</span>
        </Link>
        <Link href="/admin/categories" className="admin-tab">
          <span className="tab-icon">📁</span>
          <span>Categorías</span>
        </Link>
        <Link href="/admin/topics" className="admin-tab">
          <span className="tab-icon">🏷️</span>
          <span>Temas</span>
        </Link>
        <Link href="/admin/tags" className="admin-tab">
          <span className="tab-icon">🔖</span>
          <span>Tags</span>
        </Link>
      </nav>
    </div>
  );
}
