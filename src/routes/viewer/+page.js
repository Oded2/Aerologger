export async function load({ parent, url }) {
  const { supabase } = await parent();
  const { data: log } = await supabase
    .from("Logs")
    .select()
    .eq("id", url.searchParams.get("logId"));
  if (!log[0]) {
    return;
  }
  const { data: profile } = await supabase
    .from("Profiles")
    .select()
    .eq("user_id", log[0].user_id);
  return { log: log[0], profile: profile[0] };
}
