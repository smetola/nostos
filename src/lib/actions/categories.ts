"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import type { Visibility } from "@/lib/types";

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const icon_emoji = formData.get("icon_emoji") as string;
  const color_hex = formData.get("color_hex") as string;
  const visibility = (formData.get("visibility") as Visibility) || "public";

  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    description: description || null,
    icon_emoji: icon_emoji || "📁",
    color_hex: color_hex || "#6366f1",
    visibility,
  });

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const icon_emoji = formData.get("icon_emoji") as string;
  const color_hex = formData.get("color_hex") as string;
  const visibility = (formData.get("visibility") as Visibility) || "public";

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug: slugify(name),
      description: description || null,
      icon_emoji: icon_emoji || "📁",
      color_hex: color_hex || "#6366f1",
      visibility,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { success: true };
}
