export async function load({ params, parent }) {
  const username = params.slug;
  const { supabase } = await parent();
  const { data: userProfile } = await supabase
    .from("Profiles")
    .select()
    .eq("username", username);
  const { data: userLogs } = await supabase
    .from("Logs")
    .select()
    .eq("user_id", userProfile[0].user_id)
    .eq("public", true);
  return { profile: userProfile[0], logs: userLogs };
}
