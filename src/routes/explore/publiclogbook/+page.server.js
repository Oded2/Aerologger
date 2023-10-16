import { supabase } from "$lib/supabaseClient.js";

export const load = async () => {
  const { data } = await supabase.from("Logs").select().eq("public", true);
  return { logs: data };
};
