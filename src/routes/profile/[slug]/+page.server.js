import { supabase } from "$lib/supabaseClient.js";
import { error } from "@sveltejs/kit";
export async function load({ params }) {
  const user = params.slug;
  const { data: userProfile } = await supabase
    .from("Profiles")
    .select()
    .eq("username", user);
  if (userProfile.length == 0) {
    throw error(404, {
      message: `User "${user}" not found.`,
    });
  }
  const { data: userLogs } = await supabase
    .from("Logs")
    .select()
    .eq("user_id", userProfile[0].user_id)
    .eq("public", true);
  return { profile: userProfile[0], logs: userLogs };
}
