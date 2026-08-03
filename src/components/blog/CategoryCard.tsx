import Link from "next/link";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category & { topics: { count: number }[] };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const topicCount = category.topics?.[0]?.count ?? 0;

  return (
    <Link
      href={`/${category.slug}`}
      className="glass-card category-card"
      id={`category-${category.slug}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        borderColor: `${category.color_hex}15`,
      }}
    >
      <span className="category-card-emoji">{category.icon_emoji}</span>
      <h3
        className="category-card-name"
        style={{ color: category.color_hex }}
      >
        {category.name}
      </h3>
      {category.description && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-muted)",
            marginBottom: "var(--space-3)",
          }}
        >
          {category.description}
        </p>
      )}
      <span className="category-card-count">
        {topicCount} {topicCount === 1 ? "tema" : "temas"}
      </span>
    </Link>
  );
}
