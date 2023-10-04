<script>
  import { onMount } from "svelte";
  import { getUserDetails } from "../hooks.client.js";
  import logo from "../data/images/logo.png";
  export let data;
  const sbApi = data.sbApi;
  let fname;
  onMount(async () => {
    const user = await getUserDetails(sbApi);
    if (!user) {
      return;
    }
    fname = user.fname;
  });
</script>

<main>
  <div class="container my-5 font-google-gabarito">
    <div>
      <h1>
        Hello <span class="text-primary">{fname ? fname : "Pilot"}</span>.
      </h1>
      <h2>What would you like to do today?</h2>
      <div class="row my-3">
        <div class="col-sm mb-2">
          <button class="btn btn-primary btn-lg w-100">Log New Flight</button>
        </div>
        <div class="col-sm">
          <button class="btn btn-outline-primary btn-lg w-100"
            >View Logbook</button
          >
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <img src={logo} alt="Logo" class="img-fluid" />
    </div>
  </div>
</main>

<style>
  img {
    max-height: 50vh;
  }
</style>
