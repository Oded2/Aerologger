import { redirect } from "@sveltejs/kit";
import hrefs from "$lib/hrefs.json";

export function load() {
  throw redirect(301, hrefs.home.home.link);
}
