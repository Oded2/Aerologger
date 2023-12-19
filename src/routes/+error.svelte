<script>
  import { page } from "$app/stores";
  import Title from "$lib/components/Title.svelte";
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

<Title title={`${url.status} Error`}></Title>
