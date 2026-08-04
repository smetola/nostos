"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string;
  topic: {
    slug: string;
    name: string;
    category: {
      slug: string;
      name: string;
      icon_emoji: string | null;
      color_hex: string;
    };
  };
}

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [isOpen, onClose]);

  // Debounced search
  const search = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);

      const { data } = await supabase
        .from("posts")
        .select(
          `
          id, title, slug, excerpt, published_at,
          topic:topics!inner(
            slug, name,
            category:categories!inner(slug, name, icon_emoji, color_hex)
          )
        `
        )
        .eq("is_private", false)
        .or(
          `title.ilike.%${searchQuery}%,content_md.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`
        )
        .order("published_at", { ascending: false })
        .limit(8);

      setResults((data as unknown as SearchResult[]) ?? []);
      setLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 41,
          width: "min(90vw, 560px)",
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-surface)",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg), 0 0 60px rgba(139, 92, 246, 0.1)",
          overflow: "hidden",
          animation: "slideUp 0.25s ease-out",
        }}
        id="search-modal"
      >
        {/* Input */}
        <div
          style={{
            padding: "var(--space-4) var(--space-5)",
            borderBottom: "1px solid var(--glass-border)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <span
            style={{
              fontSize: "1.2rem",
              color: "var(--text-muted)",
              flexShrink: 0,
            }}
          >
            🔍
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en Nostos..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "var(--text-lg)",
              fontFamily: "var(--font-body)",
            }}
            id="search-input"
          />
          <kbd
            style={{
              padding: "2px 8px",
              fontSize: "var(--text-xs)",
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-muted)",
              border: "1px solid var(--glass-border)",
            }}
          >
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            padding: query.length >= 2 ? "var(--space-2)" : 0,
          }}
        >
          {loading && (
            <div
              style={{
                padding: "var(--space-6)",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "var(--text-sm)",
              }}
            >
              Buscando…
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div
              style={{
                padding: "var(--space-8)",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "var(--space-2)" }}>
                🌑
              </div>
              <div style={{ fontSize: "var(--text-sm)" }}>
                No se encontraron resultados para &ldquo;{query}&rdquo;
              </div>
            </div>
          )}

          {results.map((result) => (
            <Link
              key={result.id}
              href={`/${result.topic.category.slug}/${result.topic.slug}/${result.slug}`}
              onClick={onClose}
              style={{
                display: "block",
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                color: "inherit",
                transition: "background var(--transition-fast)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--bg-elevated)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginBottom: "2px",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: result.topic.category.color_hex,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: 600,
                  }}
                >
                  {result.topic.category.icon_emoji}{" "}
                  {result.topic.category.name} › {result.topic.name}
                </span>
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "var(--text-base)",
                  color: "var(--text-primary)",
                  marginBottom: "2px",
                }}
              >
                {result.title}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                }}
              >
                <time
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-muted)",
                  }}
                >
                  {formatDate(result.published_at)}
                </time>
                {result.excerpt && (
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--text-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "300px",
                    }}
                  >
                    — {result.excerpt}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Footer hint */}
        {query.length < 2 && (
          <div
            style={{
              padding: "var(--space-4) var(--space-5)",
              borderTop: "1px solid var(--glass-border)",
              fontSize: "var(--text-xs)",
              color: "var(--text-muted)",
              textAlign: "center",
            }}
          >
            Escribe al menos 2 caracteres para buscar
          </div>
        )}
      </div>
    </>
  );
}
