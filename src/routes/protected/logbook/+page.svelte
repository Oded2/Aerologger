<script>
  import Logbook from "../../../components/Logbook.svelte";
  export let data;
  const { supabase, session } = data;
  let { logs } = data;
</script>

<main>
  <div class="container mt-5 font-google-gabarito">
    <h1>
      Welcome to your <span class="text-aerologger">logbook</span>.
    </h1>
  </div>
  <Logbook {logs} {supabase} userId={session.user.id} />
</main>
