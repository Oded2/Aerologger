<script>
  import { page } from "$app/stores";
  import {
    getUserDetails,
    formatDate,
    getTimeStr,
  } from "../../../hooks.client.js";
  import hrefs from "../../../data/hrefs.json";
  import FloatElement from "../../../components/FloatElement.svelte";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  export let data;
  const api = data.sbApi;
  let toast;
  const allLogs = data.logs;
  const url = $page.url;
  const user = getUserDetails(api);
  const logId = url.searchParams.get("logId");
  let valid = !isNaN(logId);
  let log = {};
  for (const i of allLogs) {
    if (i["id"] == logId) {
      log = i;
    }
  }
  function formatDateTime(string = "") {
    let date = new Date(string);
    return `${formatDate(date)} at ${getTimeStr(date)}`;
  }
</script>

<main>
  <div class="container py-5">
    {#if valid}
      {#await user}
        <h1>Loading...</h1>
      {:then user}
        {#if log.public ? true : user ? user.id === log.owner : false}
          <div class="font-google-gabarito">
            <div class="text-center">
              <h1>{log.dep} to {log.des}</h1>
            </div>
            <div class="row fs-3 my-5">
              <div class="col-lg-4 mb-5">
                <div class="card shadow h-100">
                  <div class="card-header text-center">
                    <h3>
                      <i class="fa-solid fa-plane-circle-exclamation" /> Plane Information
                    </h3>
                  </div>
                  <div class="card-body">
                    <div class=" text-center border-bottom py-2">
                      Aircraft Type: <span class="text-capitalize text-primary"
                        >{log.type}</span
                      >
                    </div>
                    <div class=" text-center border-bottom py-2">
                      Aircraft Model : <span
                        class="text-capitalize text-primary"
                      >
                        {log.model}</span
                      >
                    </div>
                    <div class="text-center border-bottom py-2">
                      Aircraft ID: <span class="text-uppercase text-primary">
                        {log.identification}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 mb-5">
                <div class="card shadow h-100">
                  <div class="card-header text-center">
                    <h3>
                      <i class="fa-solid fa-plane" /> Flight Information
                    </h3>
                  </div>
                  <div class="card-body">
                    <div class=" text-center border-bottom py-2">
                      Airport of Departure: <span
                        class="text-capitalize text-primary">{log.dep}</span
                      >
                    </div>
                    <div class=" text-center border-bottom py-2">
                      Time of Departure : <span class="text-primary">
                        {formatDateTime(log.depDate)}</span
                      >
                    </div>
                    <div class="text-center border-bottom py-2">
                      Airport of Destination: <span class="text-primary">
                        {log.des}</span
                      >
                    </div>
                    <div class="text-center border-bottom py-2">
                      Time of Arrival: <span class="text-primary">
                        {formatDateTime(log.desDate)}</span
                      >
                    </div>
                    <!-- TODO: ADD TOTAL FLIGHT TIME IN HOURS AND MINUTES. -->
                  </div>
                </div>
              </div>
              <div class="col-lg-4 mb-5">
                <div class="card shadow h-100">
                  <div class="card-header text-center">
                    <h3>
                      <i class="fa-solid fa-note-sticky" /> Notes
                    </h3>
                  </div>
                  <div class="card-body">
                    <p class="font-google-quicksand">{log.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {:else}
          <h1>
            Access denied, try <a
              href={hrefs.login.home.link}
              class="text-reset">logging in</a
            >.
          </h1>
        {/if}
      {/await}
    {:else}
      <h1>Invalid Parameters</h1>
    {/if}
  </div>
</main>

<FloatElement>
  <button class="btn btn-primary btn-lg me-3"
    ><i class="fa-solid fa-share-from-square" /> Share</button
  >
  <a href={hrefs.logbook.home.link} class="btn btn-secondary btn-lg"
    ><i class="fa-solid fa-rotate-left" /> Return to Logbook</a
  >
</FloatElement>

<ToastSetup {toast} />
