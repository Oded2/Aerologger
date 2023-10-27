export async function load({ url, parent }) {
  const { supabase } = await parent();
  const logId = url.searchParams.get("logId");
  let log = null;
  if (logId) {
    const { data } = await supabase.from("Logs").select().eq("id", logId);
    log = data[0];
  }
  return { logId, log };
}
