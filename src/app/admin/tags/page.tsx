import { createClient } from "@/lib/supabase/server";
import TagsManager from "@/components/admin/TagsManager";

export default async function AdminTagsPage() {
  const supabase = await createClient();
  const { data: tags } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });

  return <TagsManager tags={tags ?? []} />;
}
