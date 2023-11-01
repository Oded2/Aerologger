<script>
  import { page } from "$app/stores";
  import MidScreen from "../components/MidScreen.svelte";
  import logo from "../data/images/logo_simplified.png";
  import hrefs from "../data/hrefs.json";
  const url = $page;
</script>

<main>
  <div class="container my-5">
    <MidScreen maxWidth={true}>
      <div class="card shadow-lg">
        <div class="card-body">
          <h2 class="card-title">There's been an error!</h2>
          <h3>{url.status}</h3>
          <h4>{url.error.message}</h4>
        </div>
        <div class="card-img-bottom d-flex justify-content-center">
          <a href={hrefs.home.home.link}>
            <img src={logo} alt="AeroLogger Logo" class="img-fluid" /></a
          >
        </div>
        <div class="card-footer">AeroLogger - Log Your Flights</div>
      </div>
    </MidScreen>
  </div>
</main>

<svelte:head>
  <title>{url.status} Error</title>
</svelte:head>

<style>
  img {
    max-height: 400px;
  }
</style>
