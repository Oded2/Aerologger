import { error } from "@sveltejs/kit";

export async function load({ parent, url }) {
  const { supabase } = await parent();
  const logId = url.searchParams.get("logId");
  const { data: log } = await supabase.from("Logs").select().eq("id", logId);
  if (log.length == 0) {
    throw error(404, {
      message: `Log "${logId}" is either set private by the owner or does not exist. If you believe this is your log, please login.`,
    });
  }
  const { data: profile } = await supabase
    .from("Profiles")
    .select()
    .eq("user_id", log[0].user_id);
  return { log: log[0], profile: profile[0] };
}
