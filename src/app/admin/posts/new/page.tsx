import { createClient } from "@/lib/supabase/server";
import PostEditor from "@/components/admin/PostEditor";

export default async function NewPostPage() {
  const supabase = await createClient();

  const [{ data: topics }, { data: tags }] = await Promise.all([
    supabase
      .from("topics")
      .select("*, category:categories(*)")
      .order("name", { ascending: true }),
    supabase.from("tags").select("*").order("name", { ascending: true }),
  ]);

  return <PostEditor topics={topics ?? []} tags={tags ?? []} />;
}
