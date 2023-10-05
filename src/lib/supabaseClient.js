import { createClient } from "@supabase/supabase-js";
import { SUPABASE } from "$env/static/private";
const sbUrl = "https://njcypmepfxckouqjunrr.supabase.co";
export const supabase = createClient(sbUrl, SUPABASE);
