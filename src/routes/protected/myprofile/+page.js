import { redirect } from "@sveltejs/kit";
import hrefs from "../../../data/hrefs.json";
export async function load({ parent }) {
  const { supabase } = await parent();
  const { data: userData } = await supabase.from("Profiles").select();
  if (userData.length == 0) {
    throw redirect(303, hrefs.explore.buildprofile.link);
  }
  return { userProfile: userData[0] };
}
