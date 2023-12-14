import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE } from "$env/static/public";
import { PUBLIC_SBURL } from "$env/static/public";
import hrefsFile from "./hrefs.json";
import countriesFile from "./countries.json";

export const hrefs = hrefsFile;
export const countries = countriesFile;
export const supabase = createClient(PUBLIC_SBURL, PUBLIC_SUPABASE);
