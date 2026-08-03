import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { PostsListManager } from "@/components/admin/PostsListManager";
import type { Post, Topic, Category } from "@/lib/types";

export default async function AdminPostsPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      topic:topics(
        name,
        slug,
        category:categories(name, slug, icon_emoji, color_hex)
      )
    `
    )
    .order("published_at", { ascending: false });

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Posts</h1>
        <Link href="/admin/posts/new" className="btn btn-primary">
          + Nuevo Post
        </Link>
      </div>

      <PostsListManager posts={posts ?? []} />
    </div>
  );
}
