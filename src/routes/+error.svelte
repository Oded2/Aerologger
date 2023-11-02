<script>
  import { page } from "$app/stores";
  import hrefs from "../data/hrefs.json";
  const url = $page;
</script>

<main>
  <div class="container py-5">
    <div class="my-5 text-center font-google-quicksand">
      <h1 class="fw-600">{`${url.status} Error`}</h1>
      <h2 class="fw-600">{url.error.message}</h2>
      <h6>
        If this was unexpected, please <a
          href={hrefs.contact.home.link}
          class="text-reset">contact me</a
        >
      </h6>
    </div>
  </div>
</main>

<svelte:head>
  <title>{url.status} Error</title>
</svelte:head>
