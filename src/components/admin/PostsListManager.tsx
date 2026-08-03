"use client";

import { useState } from "react";
import { deletePost, togglePostPrivacy } from "@/lib/actions/posts";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";

interface PostItem {
  id: string;
  title: string;
  slug: string;
  is_private: boolean;
  is_featured: boolean;
  published_at: string;
  topic: {
    name: string;
    slug: string;
    category: Category;
  };
}

interface Props {
  posts: PostItem[];
}

export function PostsListManager({ posts }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este post?")) return;
    setLoading(id);
    await deletePost(id);
    router.refresh();
    setLoading(null);
  }

  async function handleTogglePrivacy(id: string, currentPrivate: boolean) {
    setLoading(id);
    await togglePostPrivacy(id, !currentPrivate);
    router.refresh();
    setLoading(null);
  }

  return (
    <div className="topic-list">
      {posts.map((post) => (
        <div key={post.id} className="topic-item" style={{ cursor: "default", flexWrap: "wrap", gap: "var(--space-3)" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: post.topic?.category?.color_hex ?? "var(--text-muted)",
                marginBottom: "2px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
              }}
            >
              {post.topic?.category?.icon_emoji} {post.topic?.category?.name} › {post.topic?.name}
            </div>
            <div className="topic-item-name" style={{ wordBreak: "break-word" }}>
              {post.title}
            </div>
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                marginTop: "2px",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                flexWrap: "wrap",
              }}
            >
              <time>{formatDate(post.published_at)}</time>
              {post.is_private && <span className="private-badge">🔒 Privado</span>}
              {post.is_featured && (
                <span
                  style={{
                    color: "var(--accent-amber)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  ⭐ Destacado
                </span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)", flexShrink: 0 }}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => handleTogglePrivacy(post.id, post.is_private)}
              title={post.is_private ? "Hacer público" : "Hacer privado"}
              disabled={loading === post.id}
            >
              {post.is_private ? "👁️" : "🔒"}
            </button>
            <Link href={`/admin/posts/${post.id}`} className="btn btn-ghost btn-icon">
              ✏️
            </Link>
            <button
              className="btn btn-danger btn-icon"
              onClick={() => handleDelete(post.id)}
              disabled={loading === post.id}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
      {posts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-title">Sin posts</div>
          <p className="empty-state-text">Crea tu primer apunte.</p>
        </div>
      )}
    </div>
  );
}
