"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export async function createTopic(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const category_id = formData.get("category_id") as string;
  const description = formData.get("description") as string;
  const is_private = formData.get("is_private") === "true";

  const { error } = await supabase.from("topics").insert({
    name,
    slug: slugify(name),
    category_id,
    description: description || null,
    is_private,
  });

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/topics");
  return { success: true };
}

export async function updateTopic(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const category_id = formData.get("category_id") as string;
  const description = formData.get("description") as string;
  const is_private = formData.get("is_private") === "true";

  const { error } = await supabase
    .from("topics")
    .update({
      name,
      slug: slugify(name),
      category_id,
      description: description || null,
      is_private,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/topics");
  return { success: true };
}

export async function deleteTopic(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("topics").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/topics");
  return { success: true };
}
