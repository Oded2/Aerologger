import { hrefs } from "$lib/index.js";
import { redirect } from "@sveltejs/kit";

export async function load({ parent }) {
  const { supabase } = await parent();
  await supabase.auth.signOut();
  throw redirect(301, hrefs.home.link);
}
