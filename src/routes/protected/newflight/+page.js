import { error } from "@sveltejs/kit";

export async function load({ url, parent }) {
  const { supabase, session } = await parent();
  const logId = url.searchParams.get("logId");
  const edit = url.searchParams.get("edit") === "true";
  let log = null;
  if (logId) {
    const { data } = await supabase.from("Logs").select().eq("id", logId);
    log = data[0];
    if (!log || (log.user_id !== session.user.id && edit == false))
      throw error(401, { message: `Log ${logId} does not belong to you.` });
  }
  return { logId, log, edit };
}
