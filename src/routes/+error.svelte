<script>
  import { page } from "$app/stores";
  import MidScreen from "../components/MidScreen.svelte";
  import logo from "../data/images/logo_simplified.png";
  const url = $page;
</script>

<main>
  <div class="container my-5">
    <MidScreen>
      <div class="card shadow">
        <div class="card-body">
          <h2 class="card-title">Error</h2>
          <h3>Status: {url.status}</h3>
          <h3>{url.error.message}</h3>
        </div>
      </div>
    </MidScreen>
  </div>
</main>
