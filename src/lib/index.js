import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE } from "$env/static/public";
import { PUBLIC_SBURL } from "$env/static/public";
import hrefsFile from "./oldHrefs.json";
import newHrefs from "./hrefs.json";
import countriesFile from "./countries.json";

export const oldHrefs = hrefsFile;
export const hrefs = newHrefs;
export const countries = countriesFile;
export const supabase = createClient(PUBLIC_SBURL, PUBLIC_SUPABASE);
