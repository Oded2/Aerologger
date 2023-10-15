<script>
  import { page } from "$app/stores";
  import {
    formatDate,
    getTimeStr,
    formatDuration,
  } from "../../../hooks.client.js";
  import hrefs from "../../../data/hrefs.json";
  import FloatElement from "../../../components/FloatElement.svelte";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  import ShareModal from "../../../components/ShareModal.svelte";
  import AirportCard from "../../../components/AirportCard.svelte";
  import Modal from "../../../components/Modal.svelte";
  export let data;
  const { session } = data;
  let toast;
  let showModal = false,
    showShareModal = false;
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
  function toggleShareModal() {
    showShareModal = !showShareModal;
  }
  function toggleModal() {
    showModal = !showModal;
  }
</script>

<ShareModal
  showModal={showShareModal}
  on:click={toggleShareModal}
  shareText="Check out this flight from Aerologger. "
/>
<Modal {showModal} on:click={toggleModal}>
  <h1 class="font-google-quicksand text-center">Aircraft Information</h1>
  <div class="row font-google-quicksand py-2">
    <div class="col-lg">
      <h3>
        Manufacturer: <span class="fw-bold">
          {log.plane.manufacturer ?? "---"}</span
        >
      </h3>
      <h3>
        Model: <span class="fw-bold"> {log.plane.model ?? "---"}</span>
      </h3>
      <h3>
        Engine Type: <span class="fw-bold"
          >{log.plane.engine_type ?? "---"}</span
        >
      </h3>
      <h3>
        Engine Thrust: <span class="fw-bold"
          >{log.plane.engine_thrust_lb_ft
            ? parseFloat(log.plane.engine_thrust_lb_ft).toLocaleString()
            : "---"} LBF</span
        >
      </h3>
      <h3>
        Max Speed: <span class="fw-bold"
          >{log.plane.max_speed_knots
            ? parseFloat(log.plane.max_speed_knots).toLocaleString()
            : "---"} Knots</span
        >
      </h3>
      <h3>
        Cruise Speed: <span class="fw-bold"
          >{log.plane.cruise_speed_knots
            ? parseFloat(log.plane.cruise_speed_knots).toLocaleString()
            : "---"} Knots</span
        >
      </h3>
      <h3>
        Ceiling: <span class="fw-bold"
          >{log.plane.ceiling_ft
            ? parseFloat(log.plane.ceiling_ft).toLocaleString()
            : "---"} ft</span
        >
      </h3>
    </div>
    <div class="col-lg">
      <h3>
        Takeoff Ground Run: <span class="fw-bold">
          {log.plane.takeoff_ground_run_ft
            ? parseFloat(log.plane.takeoff_ground_run_ft).toLocaleString()
            : "---"} ft</span
        >
      </h3>
      <h3>
        Landing Ground Roll: <span class="fw-bold">
          {log.plane.landing_ground_roll_ft
            ? parseFloat(log.plane.landing_ground_roll_ft).toLocaleString()
            : "---"} ft</span
        >
      </h3>
      <h3>
        Gross Weight: <span class="fw-bold"
          >{log.plane.gross_weight_lbs
            ? parseFloat(log.plane.gross_weight_lbs).toLocaleString()
            : "---"} lbs</span
        >
      </h3>
      <h3>
        Empty Weight: <span class="fw-bold"
          >{log.plane.empty_weight_lbs
            ? parseFloat(log.plane.empty_weight_lbs).toLocaleString()
            : "---"} lbs</span
        >
      </h3>
      <h3>
        Length: <span class="fw-bold"
          >{log.plane.length_ft
            ? parseFloat(log.plane.length_ft).toLocaleString()
            : "---"} ft</span
        >
      </h3>
      <h3>
        Height: <span class="fw-bold"
          >{log.plane.height_ft
            ? parseFloat(log.plane.height_ft).toLocaleString()
            : "---"} ft</span
        >
      </h3>
      <h3>
        Wing Span: <span class="fw-bold"
          >{log.plane.wing_span_ft
            ? parseFloat(log.plane.wing_span_ft).toLocaleString()
            : "---"} ft</span
        >
      </h3>
      <h3>
        Range: <span class="fw-bold"
          >{log.plane.range_nautical_miles
            ? parseFloat(log.plane.range_nautical_miles).toLocaleString()
            : "---"} Nautical Miles</span
        >
      </h3>
    </div>
  </div>
</Modal>

<main>
  <div class="container py-5">
    {#if valid && log.public ? true : user ? user.id === log.user_id : false}
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
                    Aircraft Type: <span class="text-capitalize text-aerologger"
                      >{log.type}</span
                    >
                  </li>
                  <li class="list-group-item">
                    Aircraft Manufacturer: <span
                      class="text-capitalize text-aerologger"
                    >
                      {log.plane.manufacturer}</span
                    >
                  </li>
                  <li class="list-group-item">
                    Aircraft Model: <span
                      class="text-capitalize text-aerologger"
                    >
                      {log.plane.model}</span
                    >
                  </li>
                  <li class="list-group-item">
                    Tail Number: <span class=" text-aerologger">
                      {log.identification.length > 1
                        ? log.identification
                        : "None"}</span
                    >
                  </li>
                  <li class="list-group-item">
                    <button
                      class="btn btn-primary btn-lg w-100 fw-bold"
                      on:click={toggleModal}>Advanced</button
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
                  <li class="list-group-item fw-bold">
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
        Access denied, try <a href={hrefs.login.home.link} class="text-reset"
          >logging in</a
        >.
      </h1>
    {/if}
  </div>
</main>

<FloatElement>
  <button
    class="btn btn-primary btn-lg me-3"
    on:click={toggleShareModal}
    disabled={!log.public}
    ><i class="fa-solid fa-share-from-square" /> Share</button
  >
  <a href={hrefs.logbook.home.link} class="btn btn-secondary btn-lg"
    ><i class="fa-solid fa-rotate-left" /> Return</a
  >
</FloatElement>

<ToastSetup {toast} />
