<script>
  import Logbook from "../../../../components/Logbook.svelte";

  export let data;
  const { profile, logs } = data;
</script>

<main>
  <div class="container mt-5 font-google-gabarito">
    <h1>
      <span class="text-aerologger">{profile.display_name}</span>'s Profile
    </h1>
  </div>
  <Logbook {logs} allowModification={false} />
</main>
