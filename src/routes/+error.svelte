<script>
  import { page } from "$app/stores";
  import Card from "$lib/components/Card.svelte";
  import Container from "$lib/components/Container.svelte";
  import Title from "$lib/components/Title.svelte";
  import logo from "$lib/images/logo_simplified_lowres.png";
  const url = $page;
</script>

<main>
  <Container>
    <Card imgBottom imgUrl={logo} marginAuto actions={false} largeShadow>
      <div class="text-center">
        <h1 class="text-3xl font-bold">{$page.status} Error</h1>
        <h2 class="text-2xl font-semibold">{$page.error.message}</h2>
      </div>
    </Card>
  </Container>
</main>

<Title title={`${url.status} Error`}></Title>
