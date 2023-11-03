import { error } from "@sveltejs/kit";

export async function load({ url, parent }) {
  const { supabase, session } = await parent();
  const logId = url.searchParams.get("logId");
  let log = null;
  if (logId) {
    const { data } = await supabase
      .from("Logs")
      .select()
      .eq("id", logId)
      .eq("user_id", session.user.id);
    if (data.length == 0)
      throw error(401, { message: `Log ${logId} does not belong to you` });
    log = data[0];
  }
  return { logId, log };
}
