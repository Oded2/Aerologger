// src/hooks.server.js
import { PUBLIC_SUPABASE, PUBLIC_SBURL } from "$env/static/public";
import { createSupabaseServerClient } from "@supabase/auth-helpers-sveltekit";
import { redirect } from "@sveltejs/kit";
import { hrefs } from "$lib/index.js";

export const handle = async ({ event, resolve }) => {
  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SBURL,
    supabaseKey: PUBLIC_SUPABASE,
    event,
  });
  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    return session;
  };
  if (event.url.pathname.startsWith("/protected")) {
    const session = await event.locals.getSession();
    if (!session) {
      throw redirect(303, hrefs.login.home.link);
    }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range";
    },
  });
};
