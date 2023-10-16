<script>
  import Logbook from "../../../components/Logbook.svelte";
  import hrefs from "../../../data/hrefs.json";
  export let data;
  const { logs } = data;
</script>

<main>
  <div class="container mt-5 font-google-gabarito">
    <div>
      <h1>Public Logbook</h1>
      <p class="fs-4">{hrefs.explore.publiclogbook.description}</p>
    </div>
  </div>
  <Logbook {logs} allowModification={false} />
</main>
