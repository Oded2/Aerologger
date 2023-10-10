import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE } from "$env/static/public";
import { PUBLIC_SBURL } from "$env/static/public";
export const supabase = createClient(PUBLIC_SBURL, PUBLIC_SUPABASE);
