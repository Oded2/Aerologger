export async function load({ parent }) {
  const { supabase, session } = await parent();
  if (!session) {
    return;
  }
  const { data } = await supabase
    .from("Profiles")
    .select()
    .eq("user_id", session.user.id);
  return { userProfile: data[0] };
}
