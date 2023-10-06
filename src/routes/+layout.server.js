import { SUPABASE } from "$env/static/private";
const sbUrl = "https://njcypmepfxckouqjunrr.supabase.co";
export async function load() {
  return { sbApi: SUPABASE };
}
