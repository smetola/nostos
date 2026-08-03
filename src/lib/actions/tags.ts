"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export async function createTag(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const color_hex = formData.get("color_hex") as string;

  const { error } = await supabase.from("tags").insert({
    name,
    slug: slugify(name),
    color_hex: color_hex || "#8b5cf6",
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/tags");
  return { success: true };
}

export async function updateTag(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const color_hex = formData.get("color_hex") as string;

  const { error } = await supabase
    .from("tags")
    .update({
      name,
      slug: slugify(name),
      color_hex: color_hex || "#8b5cf6",
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/tags");
  return { success: true };
}

export async function deleteTag(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/tags");
  return { success: true };
}
