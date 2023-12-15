import { redirect } from "@sveltejs/kit";
import { oldHrefs } from "$lib/index.js";

export function load() {
  throw redirect(301, oldHrefs.home.home.link);
}
