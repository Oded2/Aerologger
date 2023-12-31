import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE } from "$env/static/public";
import { PUBLIC_SBURL } from "$env/static/public";
import newHrefs from "./hrefs.json";
import countriesFile from "./countries.json";
import contactFile from "./contact.json";

export const hrefs = newHrefs;
export const countries = countriesFile;
export const contact = contactFile;
export const supabase = createClient(PUBLIC_SBURL, PUBLIC_SUPABASE);
