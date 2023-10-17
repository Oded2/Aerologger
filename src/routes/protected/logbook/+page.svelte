<script>
  import hrefs from "../../../data/hrefs.json";
  import FloatElement from "../../../components/FloatElement.svelte";
  import Logbook from "../../../components/Logbook.svelte";
  export let data;
  const { supabase, logs } = data;
</script>

<main>
  <div class="container mt-5 font-google-gabarito">
    <h1>
      Welcome to your <span class="text-aerologger">logbook</span>.
    </h1>
  </div>
  <Logbook {logs} {supabase} />
</main>
<FloatElement
  ><a href={hrefs.logbook.settings.link} class="btn btn-dark btn-lg"
    ><i class="fa-solid fa-gear" /></a
  ></FloatElement
>
