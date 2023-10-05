<script>
  import { onMount } from "svelte";
  import { getUserDetails } from "../hooks.client.js";
  import hrefs from "../data/hrefs.json";
  import logo from "../data/images/logo.png";
  export let data;
  const sbApi = data.sbApi;
  const user = getUserDetails(sbApi);
</script>

<main>
  <div class="container my-5 font-google-gabarito">
    {#await user}
      <h1>Loading...</h1>
    {:then user}
      <div>
        <h1>
          Hello <span class="text-primary">{user ? user.fname : "Pilot"}</span>.
        </h1>
        <h2>What would you like to do today?</h2>
        <div class="row my-3">
          <div class="col-sm mb-2">
            <a
              href={hrefs.newFlight.home.link}
              class="btn btn-primary btn-lg w-100">Log New Flight</a
            >
          </div>
          <div class="col-sm">
            <a
              href={hrefs.logbook.home.link}
              class="btn btn-outline-primary btn-lg w-100"
            >
              View Logbook</a
            >
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <img src={logo} alt="Logo" class="img-fluid" />
      </div>
    {/await}
  </div>
</main>

<style>
  img {
    max-height: 50vh;
  }
</style>
