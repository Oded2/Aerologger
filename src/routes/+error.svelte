<script>
  import { page } from "$app/stores";
  import Container from "$lib/components/Container.svelte";
  import Title from "$lib/components/Title.svelte";
  const url = $page;
</script>

<main>
  <Container>
    <div class="font-semibold text-center">
      <h1 class="text-4xl">{`${url.status} Error`}</h1>
      <h2 class="text-3xl">{url.error.message}</h2>
    </div>
  </Container>
</main>

<Title title={`${url.status} Error`}></Title>
