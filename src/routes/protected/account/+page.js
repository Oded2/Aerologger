export async function load({ parent }) {
  const { supabase, session } = await parent();
  const { data } = await supabase
    .from("Profiles")
    .select()
    .eq("user_id", session.user.id);
  return { profile: data[0] };
}
