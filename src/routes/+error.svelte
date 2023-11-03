<script>
  import { page } from "$app/stores";
  const url = $page;
</script>

<main>
  <div class="container py-5">
    <div class="my-5 text-center font-google-quicksand">
      <h1 class="fw-600">{`${url.status} Error`}</h1>
      <h2 class="fw-600">{url.error.message}</h2>
    </div>
  </div>
</main>

<svelte:head>
  <title>{url.status} Error</title>
</svelte:head>
