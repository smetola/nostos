"use client";

import { useState } from "react";
import { createTopic, updateTopic, deleteTopic } from "@/lib/actions/topics";
import type { Topic, Category } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Props {
  topics: (Topic & { category: Category })[];
  categories: Category[];
}

export default function TopicsManager({ topics, categories }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<(Topic & { category: Category }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData(e.currentTarget);

    const result = editing
      ? await updateTopic(editing.id, formData)
      : await createTopic(formData);

    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage(editing ? "Tema actualizado" : "Tema creado");
      setShowForm(false);
      setEditing(null);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este tema? Se borrarán todos sus posts.")) return;
    setLoading(true);
    const result = await deleteTopic(id);
    if (result.error) setMessage(`Error: ${result.error}`);
    else {
      setMessage("Tema eliminado");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Temas</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancelar" : "+ Nuevo"}
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

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass-card"
          style={{ marginBottom: "var(--space-6)" }}
        >
          <div className="form-group">
            <label className="form-label">Categoría</label>
            <select
              name="category_id"
              className="form-select"
              required
              defaultValue={editing?.category_id ?? ""}
            >
              <option value="">Selecciona categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon_emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input
              name="name"
              className="form-input"
              required
              defaultValue={editing?.name ?? ""}
              placeholder="Ej: Pensamientos"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <input
              name="description"
              className="form-input"
              defaultValue={editing?.description ?? ""}
              placeholder="Opcional"
            />
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
              <span className="toggle-label">Tema privado</span>
            </label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando…" : editing ? "Actualizar" : "Crear tema"}
          </button>
        </form>
      )}

      <div className="topic-list">
        {topics.map((topic) => (
          <div key={topic.id} className="topic-item" style={{ cursor: "default" }}>
            <div>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  color: topic.category?.color_hex ?? "var(--text-muted)",
                  marginBottom: "2px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                {topic.category?.icon_emoji} {topic.category?.name}
              </div>
              <div className="topic-item-name">
                {topic.name}
                {topic.is_private && (
                  <span className="private-badge" style={{ marginLeft: "var(--space-2)" }}>
                    🔒
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => {
                  setEditing(topic);
                  setShowForm(true);
                }}
              >
                ✏️
              </button>
              <button className="btn btn-danger btn-icon" onClick={() => handleDelete(topic.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
        {topics.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🏷️</div>
            <div className="empty-state-title">Sin temas</div>
            <p className="empty-state-text">Crea tu primer tema.</p>
          </div>
        )}
      </div>
    </div>
  );
}
