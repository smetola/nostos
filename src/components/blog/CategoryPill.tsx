import type { Category } from "@/lib/types";

interface CategoryPillProps {
  category: Category;
}

export function CategoryPill({ category }: CategoryPillProps) {
  return (
    <span
      className="category-pill"
      style={{
        background: `${category.color_hex}18`,
        color: category.color_hex,
        borderColor: `${category.color_hex}30`,
        border: `1px solid ${category.color_hex}30`,
      }}
    >
      {category.icon_emoji && (
        <span style={{ fontSize: "0.85em" }}>{category.icon_emoji}</span>
      )}
      {category.name}
    </span>
  );
}
