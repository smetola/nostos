"use client";

import { useState } from "react";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";
import type { Category } from "@/lib/types";
import { useRouter } from "next/navigation";

import EmojiPicker from "@/components/ui/EmojiPicker";

interface Props {
  categories: Category[];
}

export default function CategoriesManager({ categories }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData(e.currentTarget);

    const result = editing
      ? await updateCategory(editing.id, formData)
      : await createCategory(formData);

    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage(editing ? "Categoría actualizada" : "Categoría creada");
      setShowForm(false);
      setEditing(null);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta categoría? Se borrarán todos sus temas y posts.")) return;
    setLoading(true);
    const result = await deleteCategory(id);
    if (result.error) setMessage(`Error: ${result.error}`);
    else {
      setMessage("Categoría eliminada");
      router.refresh();
    }
    setLoading(false);
  }

  function startEdit(cat: Category) {
    setEditing(cat);
    setShowForm(true);
  }

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Categorías</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancelar" : "+ Nueva"}
        </button>
      </div>

      {message && (
        <div
          className={`toast ${message.includes("Error") ? "toast-error" : "toast-success"}`}
          style={{ position: "relative", marginBottom: "var(--space-4)" }}
        >
          {message}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass-card"
          style={{ marginBottom: "var(--space-6)" }}
        >
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input
              name="name"
              className="form-input"
              required
              defaultValue={editing?.name ?? ""}
              placeholder="Ej: Filosofía"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <input
              name="description"
              className="form-input"
              defaultValue={editing?.description ?? ""}
              placeholder="Breve descripción (opcional)"
            />
          </div>
          <div style={{ display: "flex", gap: "var(--space-4)" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Emoji Icono</label>
              <EmojiPicker
                key={editing?.id ?? "new"}
                name="icon_emoji"
                value={editing?.icon_emoji ?? "📁"}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Color</label>
              <input
                name="color_hex"
                type="color"
                className="form-input"
                defaultValue={editing?.color_hex ?? "#6366f1"}
                style={{ height: "42px", padding: "4px" }}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="toggle-wrapper">
              <input type="hidden" name="is_private" value="false" />
              <input
                type="checkbox"
                name="is_private"
                value="true"
                defaultChecked={editing?.is_private ?? false}
                style={{ display: "none" }}
                onChange={(e) => {
                  const hidden = e.target.previousSibling as HTMLInputElement;
                  hidden.disabled = e.target.checked;
                }}
              />
              <div className="toggle-track">
                <div className="toggle-thumb" />
              </div>
              <span className="toggle-label">Categoría privada</span>
            </label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando…" : editing ? "Actualizar" : "Crear categoría"}
          </button>
        </form>
      )}

      {/* Categories list */}
      <div className="topic-list">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="topic-item"
            style={{ cursor: "default" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <span style={{ fontSize: "1.5rem" }}>{cat.icon_emoji}</span>
              <div>
                <div className="topic-item-name" style={{ color: cat.color_hex }}>
                  {cat.name}
                </div>
                {cat.is_private && <span className="private-badge">🔒 Privado</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => startEdit(cat)}
                title="Editar"
              >
                ✏️
              </button>
              <button
                className="btn btn-danger btn-icon"
                onClick={() => handleDelete(cat.id)}
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <div className="empty-state-title">Sin categorías</div>
            <p className="empty-state-text">Crea tu primera categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}
