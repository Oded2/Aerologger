import { redirect } from "@sveltejs/kit";
import { hrefs } from "$lib/index.js";

export function load() {
  throw redirect(301, hrefs.home.link);
}
