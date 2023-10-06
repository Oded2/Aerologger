<script>
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
    {/await}
  </div>
  <div class="text-bg-dark pb-5">
    <div class="container font-google-gabarito">
      <div class="d-flex justify-content-center">
        <img src={logo} alt="Logo" class="img-fluid" />
      </div>
      <div class="row">
        <div class="col-md-6 col-xl-4 mb-3">
          <h1>What is Aerologger?</h1>
          <p class="fs-5">
            AeroLogger is a project made to log flights conveniently, fast, and
            free. It is inspired by my other project, <a
              target="_blank"
              href="https://oded.benamotz.com"
              class="text-reset">Code Vault</a
            >, where I feature fun gimmicks on the web.
          </p>
        </div>
        <div class="col-md-6 col-xl-4 mb-3">
          <h1>Development</h1>
          <p class="fs-5">
            AeroLogger utilizes various resources to enable its functionality.
            For instance, BootStrap CSS ensures a user-friendly interface,
            Supabase powers the login system, and the website is constructed
            using the Sveltekit framework.
          </p>
        </div>
        <div class="col-xl-4 mb-3">
          <h1>Contact</h1>
          <p class="fs-5">
            Feel free to contact me if you want to request features, find bugs,
            or have a suggestion. You can either email me directly at <a
              class="text-light"
              href={`mailto:${hrefs.contact.home.mail}`}
              >{hrefs.contact.home.mail}</a
            >
            or use the fast and simple one click
            <a href={hrefs.contact.home.link} class="text-light">contact form</a
            >.
          </p>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  img {
    max-height: 50vh;
  }
</style>
