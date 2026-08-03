"use client";

import { useState } from "react";
import { createTag, updateTag, deleteTag } from "@/lib/actions/tags";
import type { Tag } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Props {
  tags: Tag[];
}

export default function TagsManager({ tags }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData(e.currentTarget);

    const result = editing
      ? await updateTag(editing.id, formData)
      : await createTag(formData);

    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage(editing ? "Etiqueta actualizada" : "Etiqueta creada");
      setShowForm(false);
      setEditing(null);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta etiqueta?")) return;
    setLoading(true);
    const result = await deleteTag(id);
    if (result.error) setMessage(`Error: ${result.error}`);
    else {
      setMessage("Etiqueta eliminada");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Etiquetas</h1>
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

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass-card"
          style={{ marginBottom: "var(--space-6)" }}
        >
          <div style={{ display: "flex", gap: "var(--space-4)" }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Nombre</label>
              <input
                name="name"
                className="form-input"
                required
                defaultValue={editing?.name ?? ""}
                placeholder="Ej: rutina"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Color</label>
              <input
                name="color_hex"
                type="color"
                className="form-input"
                defaultValue={editing?.color_hex ?? "#8b5cf6"}
                style={{ height: "42px", padding: "4px" }}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando…" : editing ? "Actualizar" : "Crear etiqueta"}
          </button>
        </form>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-3)",
        }}
      >
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="glass-card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-3) var(--space-4)",
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: tag.color_hex ?? "#8b5cf6",
                flexShrink: 0,
              }}
            />
            <span style={{ fontWeight: 600 }}>#{tag.name}</span>
            <button
              className="btn btn-ghost btn-icon"
              style={{ width: "28px", height: "28px", fontSize: "0.8rem" }}
              onClick={() => {
                setEditing(tag);
                setShowForm(true);
              }}
            >
              ✏️
            </button>
            <button
              className="btn btn-danger btn-icon"
              style={{ width: "28px", height: "28px", fontSize: "0.8rem" }}
              onClick={() => handleDelete(tag.id)}
            >
              🗑️
            </button>
          </div>
        ))}
        {tags.length === 0 && (
          <div className="empty-state" style={{ width: "100%" }}>
            <div className="empty-state-icon">🔖</div>
            <div className="empty-state-title">Sin etiquetas</div>
            <p className="empty-state-text">Crea tu primera etiqueta.</p>
          </div>
        )}
      </div>
    </div>
  );
}
