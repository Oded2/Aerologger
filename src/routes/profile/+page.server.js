import { redirect } from "@sveltejs/kit";
import { hrefs, supabase } from "$lib/index.js";

export async function load({ url }) {
  const userId = url.searchParams.get("user_id");
  if (!userId) throw redirect(301, hrefs.home.link);
  const { data } = await supabase
    .from("Profiles")
    .select("username")
    .eq("user_id", userId);
  if (data.length == 0) throw redirect(hrefs.home.link);
  throw redirect(301, hrefs.profile.link.replace("slug", data[0].username));
}
