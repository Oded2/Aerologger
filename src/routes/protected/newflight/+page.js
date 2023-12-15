import { error } from "@sveltejs/kit";
import { GetSortOrder } from "../../../hooks.client.js";

export async function load({ url, parent }) {
  const { supabase, session } = await parent();
  const logId = url.searchParams.get("preset");
  const edit = url.searchParams.get("edit") === "true";
  let log = null;
  if (logId) {
    const { data } = await supabase.from("Logs").select().eq("id", logId);
    log = data[0];
    if (!log)
      throw error(401, {
        message: `Log ${logId} is either private or doesn't exist.`,
      });
    if (edit && log.user_id !== session.user.id)
      throw error(401, {
        message: `Log ${logId} can only be edited by its owner.`,
      });
  }
  const { data: airplanes } = await supabase.from("Airplanes").select();
  airplanes.sort(GetSortOrder("make"));
  return { logId, log, edit, airplanes };
}
