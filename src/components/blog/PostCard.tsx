import Link from "next/link";
import type { Post, Tag, Category } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { TagBadge } from "./TagBadge";
import { CategoryPill } from "./CategoryPill";

interface PostCardProps {
  post: Post & {
    topic: { category: Category; name: string; slug: string };
    tags: Tag[];
  };
  showCategory?: boolean;
}

export function PostCard({ post, showCategory = true }: PostCardProps) {
  const category = post.topic?.category;
  const href = `/${category?.slug}/${post.topic?.slug}/${post.slug}`;

  return (
    <Link href={href} className="post-card" id={`post-${post.slug}`}>
      <div className="post-card-meta">
        <time className="post-card-date" dateTime={post.published_at}>
          {formatDate(post.published_at)}
        </time>
        {showCategory && category && (
          <CategoryPill category={category} />
        )}
        {post.is_private && <span className="private-badge">🔒 Privado</span>}
      </div>

      <h3 className="post-card-title">{post.title}</h3>

      {post.excerpt && (
        <p className="post-card-excerpt">{post.excerpt}</p>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="post-card-tags">
          {post.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      )}
    </Link>
  );
}
