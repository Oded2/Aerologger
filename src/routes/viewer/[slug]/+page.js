export async function load({ params, parent }) {
  const { supabase } = await parent();
  const { data: log } = await supabase
    .from("Logs")
    .select()
    .eq("id", params.slug);
  return { log: log[0] };
}
