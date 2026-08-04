import Link from "next/link";
import type { Tag } from "@/lib/types";

interface TagBadgeProps {
  tag: Tag;
  /** If true, renders as a link to the tag page */
  linked?: boolean;
  onClick?: () => void;
}

export function TagBadge({ tag, linked = false, onClick }: TagBadgeProps) {
  const style = tag.color_hex
    ? {
        background: `${tag.color_hex}18`,
        color: tag.color_hex,
        borderColor: `${tag.color_hex}30`,
      }
    : {};

  const content = (
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

  if (linked) {
    return (
      <Link
        href={`/tags/${tag.slug}`}
        onClick={(e) => e.stopPropagation()}
        style={{ textDecoration: "none" }}
      >
        {content}
      </Link>
    );
  }

  return content;
}
