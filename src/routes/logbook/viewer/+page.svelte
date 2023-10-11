<script>
  import { page } from "$app/stores";
  import {
    getUserDetails,
    formatDate,
    getTimeStr,
    formatDuration,
  } from "../../../hooks.client.js";
  import hrefs from "../../../data/hrefs.json";
  import FloatElement from "../../../components/FloatElement.svelte";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  import ShareModal from "../../../components/ShareModal.svelte";
  import AirportCard from "../../../components/AirportCard.svelte";
  export let data;
  const { session } = data;
  let toast;
  let showModal = false;
  const allLogs = data.logs;
  const url = $page.url;
  const user = session ? session.user : false;
  const logId = url.searchParams.get("logId");
  let valid = !isNaN(logId);
  let log = {};
  for (const i of allLogs) {
    if (i["id"] == logId) {
      log = i;
    }
  }
  function formatDateTime(string = "") {
    const date = new Date(string);
    return `${formatDate(date)} at ${getTimeStr(date)}`;
  }
  function toggleModal() {
    showModal = !showModal;
  }
</script>

<ShareModal
  {showModal}
  on:click={toggleModal}
  shareText="Check out this flight from Aerologger. "
/>

<main>
  <div class="container py-5">
    {#if valid}
      {#await user}
        <h1>Loading...</h1>
      {:then user}
        {#if log.public ? true : user ? user.id === log.user_id : false}
          <div class="font-google-gabarito">
            <div class="text-center">
              <h1>{log.dep.city} to {log.des.city}</h1>
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
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">
                        Aircraft Type: <span
                          class="text-capitalize text-aerologger"
                          >{log.type}</span
                        >
                      </li>
                      <li class="list-group-item">
                        Aircraft Model : <span
                          class="text-capitalize text-aerologger"
                        >
                          {log.model}</span
                        >
                      </li>
                      <li class="list-group-item">
                        Aircraft ID: <span class=" text-aerologger">
                          {log.identification}</span
                        >
                      </li>
                    </ul>
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
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">
                        {log.dep.icao} to {log.des.icao}
                      </li>
                      <li class="list-group-item">
                        Time of Departure : <span class="text-aerologger">
                          {formatDateTime(log.depDate)}</span
                        >
                      </li>

                      <li class="list-group-item">
                        Time of Arrival: <span class="text-aerologger">
                          {formatDateTime(log.desDate)}</span
                        >
                      </li>
                      <li class="list-group-item">
                        Total Duration: <span class="text-aerologger">
                          {formatDuration(
                            new Date(log.depDate),
                            new Date(log.desDate)
                          )}</span
                        >
                      </li>
                    </ul>
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
              <div
                class="{log.dep.icao === log.des.icao
                  ? 'col-lg-12'
                  : 'col-lg-6'} mb-5"
              >
                <AirportCard
                  airportData={log.dep}
                  cardTitle={log.dep.icao === log.des.icao
                    ? "Airport Information"
                    : "Departure Airport Information"}
                  icon="plane-departure"
                />
              </div>
              {#if log.dep.icao !== log.des.icao}
                <div class="col-lg-6 mb-5">
                  <AirportCard
                    airportData={log.des}
                    cardTitle="Arrival Airport Information"
                    icon="plane-arrival"
                  />
                </div>
              {/if}
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
  <button
    class="btn btn-primary btn-lg me-3"
    on:click={toggleModal}
    disabled={!log.public}
    ><i class="fa-solid fa-share-from-square" /> Share</button
  >
  <a href={hrefs.logbook.home.link} class="btn btn-secondary btn-lg"
    ><i class="fa-solid fa-rotate-left" /> Return to Logbook</a
  >
</FloatElement>

<ToastSetup {toast} />
