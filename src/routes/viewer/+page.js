import { error } from "@sveltejs/kit";

export async function load({ parent, url }) {
  const { supabase } = await parent();
  const logId = url.searchParams.get("logid");
  const ref = url.searchParams.get("ref");
  if (!logId || isNaN(logId)) throw error(400, "Invalid Parameters");
  const {
    data: [log],
  } = await supabase.from("Logs").select().eq("id", logId);
  if (!log) {
    throw error(404, {
      message: `Log ${logId} is either set private by the owner or does not exist.`,
    });
  }
  const {
    data: [profile],
  } = await supabase.from("Profiles").select().eq("user_id", log.user_id);
  const {
    data: [airplane],
  } = await supabase.from("Airplanes").select().eq("id", log.plane_id);
  log.plane = airplane;
  return { log: log, profile: profile, ref, url };
}
