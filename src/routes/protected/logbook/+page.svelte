<script>
  import { GetSortOrder } from "../../../hooks.client.js";
  import hrefs from "../../../data/hrefs.json";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  import FloatElement from "../../../components/FloatElement.svelte";
  import Modal from "../../../components/Modal.svelte";
  import Logbook from "../../../components/Logbook.svelte";
  export let data;
  const { supabase, session } = data;
  const user = session.user;
  const { logs } = data;
  let newLogs = [];

  for (const i of logs) {
    if (i.user_id !== user.id) {
      continue;
    }
    newLogs.push(i);
  }
  newLogs.sort(GetSortOrder("depDate", true));
</script>

<main>
  <div class="container mt-5 font-google-gabarito">
    <h1>
      Welcome to your <span class="text-aerologger">logbook</span>.
    </h1>
  </div>
  <Logbook logs={newLogs} {supabase} />
</main>
<FloatElement
  ><a href={hrefs.logbook.settings.link} class="btn btn-dark btn-lg"
    ><i class="fa-solid fa-gear" /></a
  ></FloatElement
>
