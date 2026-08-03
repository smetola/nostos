import type { Tag } from "@/lib/types";

interface TagBadgeProps {
  tag: Tag;
  onClick?: () => void;
}

export function TagBadge({ tag, onClick }: TagBadgeProps) {
  const style = tag.color_hex
    ? {
        background: `${tag.color_hex}18`,
        color: tag.color_hex,
        borderColor: `${tag.color_hex}30`,
      }
    : {};

  return (
    <span
      className="tag-badge"
      style={style}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }
      }}
    >
      #{tag.name}
    </span>
  );
}
