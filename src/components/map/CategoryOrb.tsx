"use client";

import type { Category } from "@/lib/types";

interface CategoryOrbProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
  topicCount: number;
}

export function CategoryOrb({
  category,
  isActive,
  onClick,
  topicCount,
}: CategoryOrbProps) {
  const color = category.color_hex || "#8b5cf6";

  return (
    <button
      className="map-orb"
      onClick={onClick}
      style={{
        left: `${category.position_x}px`,
        top: `${category.position_y}px`,
        transform: "translate(-50%, -50%)",
        zIndex: isActive ? 10 : 1,
      }}
      aria-label={`Categoría: ${category.name}`}
      id={`map-orb-${category.slug}`}
    >
      {/* Ambient glow ring */}
      <div
        style={{
          position: "absolute",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          animation: "breathe 4s ease-in-out infinite",
          animationDelay: `${Math.random() * 2}s`,
          pointerEvents: "none",
        }}
      />

      {/* Main orb */}
      <div
        className="map-orb-circle"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${color}60, ${color}30 50%, ${color}10 100%)`,
          boxShadow: isActive
            ? `0 0 50px ${color}50, 0 0 100px ${color}20, inset 0 0 30px ${color}30`
            : `0 0 30px ${color}25, inset 0 0 20px ${color}15`,
          borderColor: isActive ? `${color}80` : `${color}30`,
          transform: isActive ? "scale(1.15)" : "scale(1)",
        }}
      >
        <span style={{ fontSize: "2.2rem", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}>
          {category.icon_emoji || "📁"}
        </span>
      </div>

      {/* Label */}
      <span className="map-orb-label" style={{ color }}>
        {category.name}
      </span>

      {/* Topic count badge */}
      <span
        style={{
          marginTop: "4px",
          fontSize: "var(--text-xs)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
        }}
      >
        {topicCount} {topicCount === 1 ? "tema" : "temas"}
      </span>
    </button>
  );
}
