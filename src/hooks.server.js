// src/hooks.server.js
import { PUBLIC_SUPABASE, PUBLIC_SBURL } from "$env/static/public";
import { createSupabaseServerClient } from "@supabase/auth-helpers-sveltekit";
import { redirect } from "@sveltejs/kit";

const exceptions = ["/protected/logbook/viewer"];

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
  if (
    event.url.pathname.startsWith("/protected") &&
    !exceptions.includes(event.url.pathname)
  ) {
    const session = await event.locals.getSession();
    if (!session) {
      throw redirect(303, "/");
    }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range";
    },
  });
};
