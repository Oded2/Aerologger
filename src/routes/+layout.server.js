import { SUPABASE } from "$env/static/private";
import { APININJAS } from "$env/static/private";
export async function load() {
  return { sbApi: SUPABASE, ninjaApi: APININJAS };
}
