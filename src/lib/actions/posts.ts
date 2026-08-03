"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify, generateExcerpt } from "@/lib/utils";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const topic_id = formData.get("topic_id") as string;
  const content_md = formData.get("content_md") as string;
  const is_private = formData.get("is_private") === "true";
  const is_featured = formData.get("is_featured") === "true";
  const tagIds = formData.get("tag_ids") as string;
  const published_at = (formData.get("published_at") as string) || new Date().toISOString();

  // Create the post
  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      title,
      slug: slugify(title),
      topic_id,
      content_md,
      excerpt: generateExcerpt(content_md),
      is_private,
      is_featured,
      published_at,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Add tags if any
  if (tagIds && post) {
    const tags = tagIds
      .split(",")
      .filter(Boolean)
      .map((tagId) => ({
        post_id: post.id,
        tag_id: tagId.trim(),
      }));

    if (tags.length > 0) {
      await supabase.from("post_tags").insert(tags);
    }
  }

  revalidatePath("/");
  revalidatePath("/timeline");
  revalidatePath("/admin/posts");
  return { success: true, postId: post?.id };
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const topic_id = formData.get("topic_id") as string;
  const content_md = formData.get("content_md") as string;
  const is_private = formData.get("is_private") === "true";
  const is_featured = formData.get("is_featured") === "true";
  const tagIds = formData.get("tag_ids") as string;
  const published_at = formData.get("published_at") as string;

  const updateData: Record<string, unknown> = {
    title,
    slug: slugify(title),
    topic_id,
    content_md,
    excerpt: generateExcerpt(content_md),
    is_private,
    is_featured,
  };

  if (published_at) {
    updateData.published_at = published_at;
  }

  const { error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", id);

  if (error) return { error: error.message };

  // Update tags: delete old, insert new
  await supabase.from("post_tags").delete().eq("post_id", id);

  if (tagIds) {
    const tags = tagIds
      .split(",")
      .filter(Boolean)
      .map((tagId) => ({
        post_id: id,
        tag_id: tagId.trim(),
      }));

    if (tags.length > 0) {
      await supabase.from("post_tags").insert(tags);
    }
  }

  revalidatePath("/");
  revalidatePath("/timeline");
  revalidatePath("/admin/posts");
  return { success: true };
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/timeline");
  revalidatePath("/admin/posts");
  return { success: true };
}

export async function togglePostPrivacy(id: string, isPrivate: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({ is_private: isPrivate })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/timeline");
  revalidatePath("/admin/posts");
  return { success: true };
}
