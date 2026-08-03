import { createClient } from "@/lib/supabase/server";
import TopicsManager from "@/components/admin/TopicsManager";

export default async function AdminTopicsPage() {
  const supabase = await createClient();

  const [{ data: topics }, { data: categories }] = await Promise.all([
    supabase
      .from("topics")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
  ]);

  return (
    <TopicsManager
      topics={topics ?? []}
      categories={categories ?? []}
    />
  );
}
