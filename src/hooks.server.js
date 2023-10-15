// src/hooks.server.js
import { PUBLIC_SUPABASE, PUBLIC_SBURL } from "$env/static/public";
import { createSupabaseServerClient } from "@supabase/auth-helpers-sveltekit";

export const handle = async ({ event, resolve }) => {
  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SBURL,
    supabaseKey: PUBLIC_SUPABASE,
    event,
  });

  /**
   * a little helper that is written for convenience so that instead
   * of calling `const { data: { session } } = await supabase.auth.getSession()`
   * you just call this `await getSession()`
   */
  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    return session;
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range";
    },
  });
};
// src/routes/+layout.server.js
export const load = async ({ locals: { getSession } }) => {
  return {
    session: await getSession(),
  };
};