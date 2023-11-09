<script>
  import hrefs from "../data/hrefs.json";
  import logo from "$lib/images/logo.png";
  export let data;
  const { session } = data;
</script>

<main>
  <div class="container my-5 font-google-gabarito">
    <div>
      <h1>
        Hello <span class="text-aerologger">Pilot</span>.
      </h1>
      <h2>What would you like to do today?</h2>
      <div class="row my-3">
        <div class="col-sm mb-2">
          {#if session}
            <a
              href={hrefs.newFlight.home.link}
              class="btn btn-primary btn-lg w-100">Log New Flight</a
            >
          {:else}
            <a
              href={hrefs.signup.home.link}
              class="btn btn-primary btn-lg w-100">Join AeroLogger</a
            >
          {/if}
        </div>
        <div class="col-sm mb-2">
          {#if session}
            <a
              href={hrefs.logbook.home.link}
              class="btn btn-outline-primary btn-lg w-100"
            >
              View Logbook</a
            >
          {:else}
            <a
              href={hrefs.explore.home.link}
              class="btn btn-outline-primary btn-lg w-100">Explore AeroLogger</a
            >
          {/if}
        </div>
      </div>
    </div>
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
            free.
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
      <div class="row">
        <div class="col-lg-6 col-xl-4 mb-5">
          <div class="card h-100" data-bs-theme="light">
            <div class="card-header"><h1>Easy to Use</h1></div>
            <div class="card-body fs-5">
              <ul>
                <li>
                  To log a flight, simply go to the <a
                    href={session
                      ? hrefs.newFlight.home.link
                      : hrefs.login.home.link}
                    class="text-reset">new flight</a
                  > page, and fill out the simple form, and your logbook will automatically
                  get the most information about your time in the air.
                </li>
                <li>
                  Your logbook automatically counts your hours for you, and
                  display your data in a user-friendly way.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-xl-4 mb-5">
          <div class="card h-100" data-bs-theme="light">
            <div class="card-header">
              <h1>Free and Secure</h1>
            </div>
            <div class="card-body fs-5">
              <ul>
                <li>
                  AeroLogger is a completely free service, with the source code
                  available on <a
                    href="https://github.com/Oded2/Aerologger/tree/main"
                    class="text-reset">Github</a
                  >.
                </li>
                <li>
                  Enjoy a user-friendly experience with no intrusive
                  advertisements.
                </li>
                <li>Make your flight logs public or private to the public.</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-xl-4 mb-5">
          <div class="card h-100" data-bs-theme="light">
            <div class="card-header">
              <h1>Notices</h1>
            </div>
            <div class="card-body fs-5">
              <ul>
                <li>
                  AeroLogger may or may not stay open source in the future.
                </li>
                <li>
                  AeroLogger is still a demo project, nothing is 100% complete.
                </li>
                <li>
                  Please do not share sensitive information with AeroLogger.
                </li>
                <li>
                  While the public may not see any users logs (unless deemed
                  public by the user), trusted admins have access to each log,
                  regardless of its public status.
                </li>
              </ul>
            </div>
          </div>
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
