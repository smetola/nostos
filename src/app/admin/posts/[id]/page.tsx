import { createClient } from "@/lib/supabase/server";
import PostEditor from "@/components/admin/PostEditor";
import { notFound } from "next/navigation";
import type { Tag } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: post }, { data: topics }, { data: tags }] = await Promise.all([
    supabase
      .from("posts")
      .select("*, tags:post_tags(tag:tags(*))")
      .eq("id", id)
      .single(),
    supabase
      .from("topics")
      .select("*, category:categories(*)")
      .order("name", { ascending: true }),
    supabase.from("tags").select("*").order("name", { ascending: true }),
  ]);

  if (!post) notFound();

  // Transform tags
  const postWithTags = {
    ...post,
    tags: ((post.tags as { tag: Tag }[]) ?? []).map(
      (pt: { tag: Tag }) => pt.tag
    ),
  };

  return (
    <PostEditor
      topics={topics ?? []}
      tags={tags ?? []}
      existingPost={postWithTags}
    />
  );
}
