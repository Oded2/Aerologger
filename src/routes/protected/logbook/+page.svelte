<script>
  import Container from "$lib/components/Container.svelte";
  import Logbook from "$lib/components/Logbook.svelte";
  export let data;
  const { supabase, session } = data;
  let { logs } = data;
</script>

<main>
  <Container>
    <div>
      <h1 class="text-4xl font-bold">
        Welcome to your <span class="text-primary">logbook</span>.
      </h1>
    </div>
    <Logbook {logs} {supabase} userId={session.user.id} />
  </Container>
</main>
