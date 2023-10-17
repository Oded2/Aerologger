export async function load({ parent }) {
  const { supabase } = await parent();
  const { data } = await supabase.from("Profiles").select();
  return { profile: data[0] };
}
