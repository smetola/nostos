"use client";

import { useState } from "react";
import { createPost, updatePost } from "@/lib/actions/posts";
import type { Topic, Category, Tag, Post } from "@/lib/types";
import { useRouter } from "next/navigation";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";

interface Props {
  topics: (Topic & { category: Category })[];
  tags: Tag[];
  existingPost?: Post & { tags: Tag[] };
}

export default function PostEditor({ topics, tags, existingPost }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [content, setContent] = useState(existingPost?.content_md ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    existingPost?.tags?.map((t) => t.id) ?? []
  );
  const [isPrivate, setIsPrivate] = useState(existingPost?.is_private ?? false);
  const [isFeatured, setIsFeatured] = useState(existingPost?.is_featured ?? false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    formData.set("content_md", content);
    formData.set("tag_ids", selectedTags.join(","));
    formData.set("is_private", isPrivate.toString());
    formData.set("is_featured", isFeatured.toString());

    const result = existingPost
      ? await updatePost(existingPost.id, formData)
      : await createPost(formData);

    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage(existingPost ? "Post actualizado ✓" : "Post creado ✓");
      if (!existingPost) {
        router.push("/admin/posts");
      }
      router.refresh();
    }
    setLoading(false);
  }

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  // Group topics by category for the selector
  const topicsByCategory = topics.reduce(
    (acc, topic) => {
      const catName = topic.category?.name ?? "Sin categoría";
      if (!acc[catName]) acc[catName] = [];
      acc[catName].push(topic);
      return acc;
    },
    {} as Record<string, typeof topics>
  );

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">
          {existingPost ? "Editar Post" : "Nuevo Post"}
        </h1>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button
            className={`btn ${showPreview ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setShowPreview(!showPreview)}
            type="button"
          >
            {showPreview ? "Editar" : "Preview"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`toast ${message.includes("Error") ? "toast-error" : "toast-success"}`}
          style={{ position: "relative", marginBottom: "var(--space-4)" }}
        >
          {message}
        </div>
      )}

      {showPreview ? (
        <div className="glass-card">
          <div className="prose">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Título</label>
            <input
              name="title"
              className="form-input"
              required
              defaultValue={existingPost?.title ?? ""}
              placeholder="Título del apunte"
              style={{ fontSize: "var(--text-xl)", fontWeight: 600 }}
            />
          </div>

          {/* Topic selector */}
          <div className="form-group">
            <label className="form-label">Tema</label>
            <select
              name="topic_id"
              className="form-select"
              required
              defaultValue={existingPost?.topic_id ?? ""}
            >
              <option value="">Selecciona un tema</option>
              {Object.entries(topicsByCategory).map(([catName, catTopics]) => (
                <optgroup key={catName} label={catName}>
                  {catTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label">Fecha de publicación</label>
            <input
              name="published_at"
              type="datetime-local"
              className="form-input"
              defaultValue={
                existingPost?.published_at
                  ? new Date(existingPost.published_at).toISOString().slice(0, 16)
                  : new Date().toISOString().slice(0, 16)
              }
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label className="form-label">Contenido (Markdown)</label>
            <textarea
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tu apunte en Markdown..."
              style={{ minHeight: "350px", fontFamily: "monospace", fontSize: "var(--text-sm)" }}
            />
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="form-group">
              <label className="form-label">Etiquetas</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-2)",
                }}
              >
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    className="tag-badge"
                    onClick={() => toggleTag(tag.id)}
                    style={{
                      cursor: "pointer",
                      opacity: selectedTags.includes(tag.id) ? 1 : 0.4,
                      background: selectedTags.includes(tag.id)
                        ? `${tag.color_hex ?? "#8b5cf6"}30`
                        : undefined,
                      borderColor: selectedTags.includes(tag.id)
                        ? tag.color_hex ?? undefined
                        : undefined,
                      color: selectedTags.includes(tag.id)
                        ? tag.color_hex ?? undefined
                        : undefined,
                    }}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Privacy & Featured */}
          <div
            style={{
              display: "flex",
              gap: "var(--space-6)",
              marginBottom: "var(--space-6)",
              flexWrap: "wrap",
            }}
          >
            <label className="toggle-wrapper" onClick={() => setIsPrivate(!isPrivate)}>
              <div className={`toggle-track ${isPrivate ? "active" : ""}`}>
                <div className="toggle-thumb" />
              </div>
              <span className="toggle-label">🔒 Privado</span>
            </label>

            <label className="toggle-wrapper" onClick={() => setIsFeatured(!isFeatured)}>
              <div className={`toggle-track ${isFeatured ? "active" : ""}`}>
                <div className="toggle-thumb" />
              </div>
              <span className="toggle-label">⭐ Destacado</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "var(--space-4)" }}
          >
            {loading
              ? "Guardando…"
              : existingPost
              ? "Actualizar post"
              : "Publicar apunte"}
          </button>
        </form>
      )}
    </div>
  );
}
