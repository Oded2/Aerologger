<script>
  import Logbook from "../../../components/Logbook.svelte";
  import MidScreen from "../../../components/MidScreen.svelte";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  import { createToast } from "../../../hooks.client.js";
  export let data;
  const { supabase, session } = data;
  let { logs } = data;
  let toast;
  let inProgress = false;
</script>

<main>
  <div class="container mt-5 font-google-gabarito">
    <h1>
      Welcome to your <span class="text-aerologger">logbook</span>.
    </h1>
  </div>
  <Logbook {logs} {supabase} userId={session.user.id} />
</main>
