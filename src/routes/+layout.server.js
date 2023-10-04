import { SUPABASE } from "$env/static/private";
export async function load() {
  return { sbApi: SUPABASE };
}
