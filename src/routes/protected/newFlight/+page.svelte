<script>
  import {
    addParamsString,
    createToast,
    dateToStr,
    getTimeStr,
    parseDateAndTime,
  } from "../../../hooks.client.js";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  import Switch from "../../../components/Switch.svelte";
  import hrefs from "../../../data/hrefs.json";
  import logo from "../../../data/images/logo_simplified.png";
  export let data;
  const ninjaApi = data.api;
  const { supabase } = data;
  const { session } = data;
  const user = session ? session.user : false;
  const airportUrl = "https://api.api-ninjas.com/v1/airports";
  let toast;
  let dep = "",
    des = "";
  let dateStr = dateToStr();
  let depTimeStr = getTimeStr(),
    desTimeStr = getTimeStr();
  let planeType = "airplane",
    planeManu = "",
    planeModel = "",
    planeId = "";
  let userNotes = "";
  let isPublic = true;
  let inProgress = false,
    isComplete = false;
  let submitText = "Submit Flight";
  $: submitText = inProgress ? submitText : "Submit Flight";
  let logNumber = NaN;
  $: planeId = planeId.toUpperCase();
  $: depDate = parseDateAndTime(dateStr, depTimeStr);
  async function getAirportDetails(airport = "") {
    const url = addParamsString(
      airportUrl,
      airport.length == 3
        ? { iata: airport }
        : airport.length == 4
        ? { icao: airport }
        : { name: airport }
    );
    try {
      const response = (
        await fetch(url, { headers: { "X-Api-Key": ninjaApi } })
      ).json();
      return await response;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async function fetchPlane() {
    const response = await fetch(
      addParamsString("https://api.api-ninjas.com/v1/aircraft", {
        manufacturer: planeManu,
        model: planeModel,
      }),
      { headers: { "X-Api-Key": ninjaApi } }
    );
    return await response.json();
  }
  async function submit() {
    if (!verify()) {
      return;
    }
    const desDate =
      parseDateAndTime(dateStr, desTimeStr).valueOf() >= depDate.valueOf()
        ? parseDateAndTime(dateStr, desTimeStr)
        : parseDateAndTime(
            dateToStr(new Date(depDate.valueOf() + 86400000)),
            desTimeStr
          );
    inProgress = true;
    submitText = "Fetching Aircraft";
    const plane = await fetchPlane();
    if (plane.length < 1) {
      showError("Plane not found.");
      inProgress = false;
      return;
    }
    submitText = "Fetching Departure Airport";
    const depAirport = await getAirportDetails(dep);
    if (depAirport.length != 1) {
      showError("Departure airport not found.");
      inProgress = false;
      return;
    }
    submitText = "Fetching Destination Airport";
    const desAirport = await getAirportDetails(des);
    if (desAirport.length != 1) {
      showError("Destination airport not found");
      inProgress = false;
      return;
    }
    submitText = "Inserting Into Database";
    const { data, error } = await supabase
      .from("Logs")
      .insert({
        user_id: user.id,
        dep: depAirport[0],
        des: desAirport[0],
        depDate: depDate.toISOString(),
        desDate: desDate.toISOString(),
        type: planeType,
        plane: plane[0],
        identification: planeId,
        notes: userNotes,
        public: isPublic,
      })
      .select();
    submitText = "Submit Flight";
    inProgress = false;
    logNumber = data[0].id;
    if (error) {
      showError(error.message);
      return;
    }
    isComplete = true;
    dep = "";
    des = "";
    dateStr = dateToStr();
    depTimeStr = getTimeStr();
    desTimeStr = getTimeStr();
    planeType = "airplane";
    planeManu = "";
    planeModel = "";
    planeId = "";
    userNotes = "";
  }
  function verify() {
    if (!planeType || planeType.length == 0) {
      showError("Aircraft type cannot be empty");
      return false;
    }
    if (!dep || dep.length == 0) {
      showError("Airport of departure cannot be empty");
      return false;
    }
    if (!dep || des.length == 0) {
      showError("Airport of destination cannot be empty");
      return false;
    }
    if (!planeManu || planeManu.length == 0) {
      showError("Plane manufacturer cannot be empty");
      return false;
    }
    if (!planeModel || planeModel.length == 0) {
      showError("Plane model cannot be empty.");
      return false;
    }
    if (isNaN(depDate.valueOf())) {
      showError("Date or time is invalid");
      return false;
    }
    return true;
  }
  function showError(desc) {
    toast = createToast("error", "Error", desc);
  }
</script>

<main>
  <div class="container my-5 font-google-gabarito">
    {#if user}
      {#if isComplete}
        <h1 class="text-success">Success!</h1>
        <h2>
          Your flight has been added to your <a href={hrefs.logbook.home.link}
            >logbook</a
          >.
        </h2>

        <div class="row my-4">
          <div class="col">
            <a
              href={addParamsString(hrefs.logbook.viewer.link, {
                logId: logNumber,
              })}
              class="btn btn-primary btn-lg fs-2 w-100 h-100">View Flight</a
            >
          </div>
          <div class="col">
            <button
              on:click={() => (isComplete = false)}
              class="btn btn-outline-primary btn-lg fs-2 w-100 h-100"
              >Log New Flight</button
            >
          </div>

          <div class="d-flex justify-content-center">
            <img src={logo} alt="AeroLogger's Logo" class="img-fluid" />
          </div>
        </div>
      {:else}
        <div>
          <h1>Welcome back, {user.user_metadata.first_name}.</h1>
        </div>
        <form on:submit|preventDefault={submit}>
          <div class="card">
            <div class="card-body fs-3">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="dep" class="form-label"
                    >Airport of Departure</label
                  >
                  <input
                    type="text"
                    id="dep"
                    class="form-control"
                    bind:value={dep}
                  />
                  <span class="form-text">Name, IATA, or ICAO code</span>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="des" class="form-label"
                    >Airport of Destination
                  </label>
                  <input
                    type="text"
                    id="des"
                    class="form-control"
                    bind:value={des}
                  />
                  <span class="form-text">Name, IATA, or ICAO code</span>
                </div>
                <div class="col-md-6 col-xl-4 mb-3">
                  <label for="depdate" class="form-label">Date</label>
                  <div class="input-group">
                    <button
                      class="input-group-text btn btn-secondary"
                      type="button"
                      disabled={dateStr == dateToStr()}
                      on:click={() => (dateStr = dateToStr())}>Today</button
                    >
                    <input
                      type="date"
                      id="depdate"
                      class="form-control"
                      bind:value={dateStr}
                    />
                  </div>
                </div>
                <div class="col-md-6 col-xl-4 mb-3">
                  <label for="deptime" class="form-label"
                    >Time of Departure</label
                  >

                  <input
                    type="time"
                    id="deptime"
                    class="form-control"
                    bind:value={depTimeStr}
                  />
                </div>

                <div class="col-md-6 col-xl-4 mb-3">
                  <label for="destime" class="form-label">Time of Arrival</label
                  >
                  <input
                    type="time"
                    id="destime"
                    class="form-control"
                    bind:value={desTimeStr}
                  />
                </div>

                <div class="col-md-6 col-xl-3 mb-3">
                  <label for="planemanu" class="form-label"
                    >Aircraft Manufacturer</label
                  >
                  <input
                    id="planemanu"
                    class="form-control"
                    bind:value={planeManu}
                    placeholder={'"Cessna"'}
                  />
                </div>
                <div class="col-md-6 col-xl-3 mb-3">
                  <label for="planemodel" class="form-label"
                    >Aircraft Model</label
                  >
                  <input
                    id="planemodel"
                    class="form-control"
                    bind:value={planeModel}
                    placeholder={'"172"'}
                  />
                </div>

                <div class="col-md-6 col-xl-3 mb-3">
                  <label for="planeid" class="form-label">Tail Number</label>
                  <input
                    id="planeid"
                    class="form-control"
                    bind:value={planeId}
                    placeholder={'"4X-CHA"'}
                  />
                </div>
                <div class="col-md-6 col-xl-3 mb-3">
                  <label for="planetype" class="form-label">Aircraft Type</label
                  >
                  <select id="planetype" class="form-select">
                    <option value="airplane" selected>Airplane</option>
                    <option value="helicopter">Helicopter</option>
                    <option value="glider">Sailplane / Glider</option>
                    <option value="rc">Remote Control (rc)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="col-12 mb-3">
                  <label for="notes" class="form-label">Notes</label>
                  <textarea
                    dir="auto"
                    id="notes"
                    rows="4"
                    class="form-control fs-5"
                    bind:value={userNotes}
                  />
                </div>
                <div class="col-auto">
                  <Switch bind:checked={isPublic} text="Make public" />
                  <span class="font-reset fw-light fs-6"
                    >You can always change this later.</span
                  >
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button
                class="btn btn-primary btn-lg w-100 fs-4"
                type="submit"
                disabled={inProgress}>{submitText}</button
              >
            </div>
          </div>
        </form>
      {/if}
    {:else}
      <h1>User not logged in.</h1>
    {/if}
  </div>
</main>
<ToastSetup {toast} />

<style>
  textarea {
    resize: none;
  }

  img {
    max-height: 60vh;
  }
</style>
