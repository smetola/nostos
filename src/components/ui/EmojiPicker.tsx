"use client";

import { useState, useRef, useEffect } from "react";
import { EMOJI_CATEGORIES, filterEmojis, EmojiItem } from "@/lib/emojiData";

interface EmojiPickerProps {
  name?: string;
  value?: string;
  onChange?: (emoji: string) => void;
}

const QUICK_TAGS = [
  { label: "Salud 🏥", query: "salud" },
  { label: "Health 🩺", query: "health" },
  { label: "Tecnología 💻", query: "tecnologia" },
  { label: "Mente 🧠", query: "mente" },
  { label: "Arte 🎨", query: "arte" },
  { label: "Viajes ✈️", query: "viajes" },
  { label: "Comida 🥗", query: "comida" },
  { label: "Dinero 💰", query: "dinero" },
];

export default function EmojiPicker({
  name = "icon_emoji",
  value = "📁",
  onChange,
}: EmojiPickerProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string>(value || "📁");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state when controlled prop value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedEmoji(value || "📁");
    }
  }, [value]);

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function handleSelect(emojiStr: string) {
    setSelectedEmoji(emojiStr);
    if (onChange) onChange(emojiStr);
    setIsOpen(false);
  }

  const filteredEmojis = filterEmojis(searchQuery, activeCategory);

  return (
    <div style={{ position: "relative", width: "100%" }} ref={popoverRef}>
      {/* Hidden input to pass emoji in standard form submissions */}
      <input type="hidden" name={name} value={selectedEmoji} />

      {/* Control row */}
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setIsOpen(!isOpen)}
          title="Seleccionar emoji"
          style={{
            fontSize: "1.3rem",
            padding: "8px 14px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            height: "42px",
            borderColor: isOpen ? "var(--accent-primary)" : undefined,
          }}
        >
          <span>{selectedEmoji || "📁"}</span>
          <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>🔍</span>
        </button>

        <input
          type="text"
          className="form-input"
          value={selectedEmoji}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedEmoji(val);
            if (onChange) onChange(val);
          }}
          placeholder="Ej: 🏥 o salud"
          style={{ flex: 1 }}
        />
      </div>

      {/* Popover Dropdown Picker */}
      {isOpen && (
        <div
          className="glass-card"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 1000,
            width: "360px",
            maxWidth: "92vw",
            maxHeight: "440px",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
            padding: "var(--space-4)",
            boxShadow: "0 16px 36px rgba(0, 0, 0, 0.4)",
            border: "1px solid var(--accent-glow, rgba(139, 92, 246, 0.3))",
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          {/* Header & Search */}
          <div style={{ position: "relative" }}>
            <input
              ref={searchInputRef}
              type="text"
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar (ej: salud, health, tech)..."
              style={{
                width: "100%",
                paddingRight: searchQuery ? "32px" : "12px",
                fontSize: "0.88rem",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick search chips */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              paddingBottom: "4px",
              scrollbarWidth: "none",
            }}
          >
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag.query}
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setSearchQuery(tag.query);
                  setActiveCategory("all");
                }}
                style={{
                  fontSize: "0.75rem",
                  padding: "3px 8px",
                  whiteSpace: "nowrap",
                  borderRadius: "12px",
                  background:
                    searchQuery.toLowerCase() === tag.query
                      ? "rgba(139, 92, 246, 0.3)"
                      : "rgba(255, 255, 255, 0.05)",
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              overflowX: "auto",
              paddingBottom: "6px",
              borderBottom: "1px solid var(--glass-border)",
            }}
          >
            {EMOJI_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                title={cat.name}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery("");
                }}
                style={{
                  background: activeCategory === cat.id ? "var(--glass-bg-hover)" : "transparent",
                  border: "none",
                  borderBottom: activeCategory === cat.id ? "2px solid var(--accent-primary)" : "2px solid transparent",
                  borderRadius: "4px 4px 0 0",
                  padding: "4px 8px",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {cat.icon}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "6px",
              maxHeight: "220px",
              paddingRight: "4px",
            }}
          >
            {filteredEmojis.map((item: EmojiItem, index: number) => {
              const isSelected = selectedEmoji === item.emoji;
              return (
                <button
                  key={`${item.emoji}-${index}`}
                  type="button"
                  title={`${item.name} (${item.keywords.slice(0, 3).join(", ")})`}
                  onClick={() => handleSelect(item.emoji)}
                  style={{
                    fontSize: "1.5rem",
                    padding: "6px",
                    background: isSelected ? "rgba(139, 92, 246, 0.35)" : "transparent",
                    border: isSelected ? "1px solid var(--accent-primary)" : "1px solid transparent",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "transform 0.1s ease, background 0.1s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.2)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = isSelected ? "rgba(139, 92, 246, 0.35)" : "transparent";
                  }}
                >
                  {item.emoji}
                </button>
              );
            })}

            {filteredEmojis.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "var(--space-6) 0",
                  color: "var(--text-muted)",
                  fontSize: "0.88rem",
                }}
              >
                No se encontraron emojis para &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
