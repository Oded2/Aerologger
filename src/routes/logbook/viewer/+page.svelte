<script>
  import { page } from "$app/stores";
  import {
    getUserDetails,
    formatDate,
    getTimeStr,
    formatDuration,
    getCountryByCode,
    getOpenStreetMap,
  } from "../../../hooks.client.js";
  import hrefs from "../../../data/hrefs.json";
  import FloatElement from "../../../components/FloatElement.svelte";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  import ShareModal from "../../../components/ShareModal.svelte";
  export let data;
  const api = data.sbApi;
  let toast;
  let showModal = false;
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
        {#if log.public ? true : user ? user.id === log.owner : false}
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
                    <div class=" text-center border-bottom py-2">
                      Aircraft Type: <span
                        class="text-capitalize text-aerologger">{log.type}</span
                      >
                    </div>
                    <div class=" text-center border-bottom py-2">
                      Aircraft Model : <span
                        class="text-capitalize text-aerologger"
                      >
                        {log.model}</span
                      >
                    </div>
                    <div class="text-center py-2">
                      Aircraft ID: <span class="text-uppercase text-aerologger">
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
                  <div class="card-body text-center">
                    <div class="  border-bottom py-2">
                      {log.dep.icao} to {log.des.icao}
                    </div>
                    <div class="  border-bottom py-2">
                      Time of Departure : <span class="text-aerologger">
                        {formatDateTime(log.depDate)}</span
                      >
                    </div>

                    <div class=" border-bottom py-2">
                      Time of Arrival: <span class="text-aerologger">
                        {formatDateTime(log.desDate)}</span
                      >
                    </div>
                    <div class=" py-2">
                      Total Duration: <span class="text-aerologger">
                        {formatDuration(
                          new Date(log.depDate),
                          new Date(log.desDate)
                        )}</span
                      >
                    </div>
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
                <div class="card shadow h-100">
                  <div class="card-header text-center">
                    <h3>
                      <i class="fa-solid fa-plane-departure" />
                      {#if log.dep.icao !== log.des.icao}Departure{/if} Airport Information
                    </h3>
                  </div>
                  <div class="card-body">
                    <ul>
                      <li>
                        Name: {log.dep.name}
                      </li>
                      <li>ICAO Code: {log.dep.icao}</li>
                      <li>
                        IATA Code: {log.dep.iata.length > 0
                          ? log.dep.iata
                          : "Not found"}
                      </li>
                      <li>City: {log.dep.city}</li>
                      <li>Region: {log.dep.region}</li>
                      <li>Country: {getCountryByCode(log.dep.country)}</li>
                      <li>Elevation: {log.dep.elevation_ft} ft</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <iframe
                      src={getOpenStreetMap(
                        parseFloat(log.dep.latitude),
                        parseFloat(log.dep.longitude)
                      )}
                      frameborder="0"
                      title="Open Street Map"
                    />
                  </div>
                </div>
              </div>
              {#if log.dep.icao !== log.des.icao}
                <div class="col-lg-6 mb-5">
                  <div class="card shadow h-100">
                    <div class="card-header text-center">
                      <h3>
                        <i class="fa-solid fa-plane-arrival" /> Arrival Airport Information
                      </h3>
                    </div>
                    <div class="card-body">
                      <ul>
                        <li>
                          Name: {log.des.name}
                        </li>
                        <li>ICAO Code: {log.des.icao}</li>
                        <li>
                          IATA Code: {log.des.iata.length > 0
                            ? log.des.iata
                            : "Not found"}
                        </li>
                        <li>City: {log.des.city}</li>
                        <li>Region: {log.des.region}</li>
                        <li>Country: {getCountryByCode(log.des.country)}</li>
                        <li>Elevation: {log.des.elevation_ft} ft</li>
                        <li />
                      </ul>
                    </div>
                    <div class="card-footer">
                      <iframe
                        src={getOpenStreetMap(
                          parseFloat(log.des.latitude),
                          parseFloat(log.des.longitude)
                        )}
                        frameborder="0"
                        title="Open Street Map"
                      />
                    </div>
                  </div>
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

<style>
  iframe {
    width: 100%;
    height: 400px;
  }
</style>
