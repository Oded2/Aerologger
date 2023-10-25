export async function load({ params, parent, url }) {
  const user = params.slug;
  const { supabase } = await parent();
  const { data: userProfile } = await supabase
    .from("Profiles")
    .select()
    .eq("username", user);
  const { data: userLogs } = await supabase
    .from("Logs")
    .select()
    .eq("user_id", userProfile[0].user_id)
    .eq("public", true);
  return { profile: userProfile[0], logs: userLogs };
}
