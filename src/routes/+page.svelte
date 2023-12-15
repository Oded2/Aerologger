<script>
  import Container from "$lib/components/Container.svelte";
  import { hrefs } from "$lib/index.js";
  export let data;
  const { session } = data;
</script>

<main>
  <Container>
    <div class="grid grid-cols-2 gap-2 mb-24">
      <div>
        <h1 class="text-6xl text-center sm:text-left">
          Hello <span class="text-primary">Pilot</span>.
        </h1>
        <h2 class="text-4xl">What would you like to do today?</h2>
      </div>
      <div class="grid grid-cols-2 gap-10 place-content-center">
        {#if session}
          <div>
            <a href={hrefs.logbook.link} class="btn btn-secondary w-full"
              >View Logbook</a
            >
          </div>
          <div>
            <a href={hrefs.logbook.link} class="btn btn-primary w-full"
              >Log New Flight</a
            >
          </div>
        {:else}
          <div>
            <a href={hrefs.login.link} class="btn btn-secondary">Login</a>
          </div>
          <div>
            <a href={hrefs.signup.link} class="btn btn-primary">Sign Up</a>
          </div>
        {/if}
      </div>
    </div>
    <div>
      <h1 class="text-4xl">About AeroLogger</h1>
    </div>
  </Container>
</main>
