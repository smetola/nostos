"use client";

import type { Topic } from "@/lib/types";
import Link from "next/link";

interface TopicNodeProps {
  topic: Topic;
  categorySlug: string;
  categoryColor: string;
  /** Position relative to center of parent orb */
  offsetX: number;
  offsetY: number;
  /** Parent orb absolute position */
  parentX: number;
  parentY: number;
}

export function TopicNode({
  topic,
  categorySlug,
  categoryColor,
  offsetX,
  offsetY,
  parentX,
  parentY,
}: TopicNodeProps) {
  const color = categoryColor || "#8b5cf6";
  const x = parentX + offsetX;
  const y = parentY + offsetY;

  return (
    <Link
      href={`/${categorySlug}/${topic.slug}`}
      className="map-topic-node"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle at 40% 40%, ${color}35, ${color}12 70%, transparent 100%)`,
        border: `1px solid ${color}30`,
        boxShadow: `0 0 20px ${color}15`,
        color: "var(--text-primary)",
        width: "72px",
        height: "72px",
        fontSize: "var(--text-xs)",
        lineHeight: 1.2,
      }}
      id={`map-topic-${topic.slug}`}
    >
      {topic.name}
    </Link>
  );
}
