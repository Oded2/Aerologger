<script>
  import {
    createSbClient,
    createToast,
    dateToStr,
    getTimeStr,
    getUserDetails,
    parseDateAndTime,
  } from "../../hooks.client.js";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  import Switch from "../../components/Switch.svelte";
  import airports from "../../data/airports.json";
  export let data;
  const api = data.sbApi;
  const sb = createSbClient(api);
  const user = getUserDetails(api);
  let toast;
  let dep = "",
    des = "";
  let depDateStr = dateToStr(),
    desDateStr = dateToStr();
  let depTimeStr = getTimeStr(),
    desTimeStr = getTimeStr();
  let planeType = "airplane",
    planeModel = "",
    planeId = "";
  let userNotes = "";
  let isPublic = true;
  let inProgress = false;
  let depSync = true;
  $: dep = dep.toUpperCase();
  $: des = des.toUpperCase();
  $: planeId = planeId.toUpperCase();
  $: depDate = parseDateAndTime(depDateStr, depTimeStr);
  $: desDate = parseDateAndTime(desDateStr, desTimeStr);

  $: if (depSync) {
    desDateStr = depDateStr;
  }
  async function submit() {
    if (!verify()) {
      return;
    }
    inProgress = true;
    const userId = (await user).id;
    const { error } = await sb.from("Logs").insert({
      owner: userId,
      dep: dep,
      des: des,
      depDate: depDate.toISOString(),
      desDate: desDate.toISOString(),
      type: planeType,
      model: planeModel,
      identification: planeId,
      notes: userNotes,
      public: isPublic,
    });
    inProgress = false;
    if (error) {
      showError(error.message);
      return;
    }
    dep = "";
    des = "";
    depDateStr = dateToStr();
    desDateStr = dateToStr();
    depTimeStr = getTimeStr();
    desTimeStr = getTimeStr();
    planeType = "airplane";
    planeModel = "";
    planeId = "";
    userNotes = "";
    toast = createToast(
      "success",
      "Flight Added",
      "Your flight is now available in your logbook."
    );
  }
  function verify() {
    let depValid = false,
      desValid = false;
    if (!planeType || planeType.length == 0) {
      showError("Aircraft type cannot be empty");
      return false;
    }
    if (dep.length == 0) {
      showError("Airport of departure cannot be empty");
      return false;
    }
    if (des.length == 0) {
      showError("Airport of destination cannot be empty");
      return false;
    }
    if (depDate.valueOf() > desDate.valueOf()) {
      showError("Departure must be before arrival");
      return false;
    }
    for (const i of airports) {
      if (dep === i.icao) {
        depValid = true;
      }
      if (des === i.icao) {
        desValid = true;
      }
    }
    if (!depValid) {
      showError("Departure airport must be a valid ICAO code.");
      return false;
    }
    if (!desValid) {
      showError("Destination airport must be a valid ICAO code.");
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
    {#await user}
      <h1>Loading...</h1>
    {:then user}
      {#if user}
        <div>
          <h1>Welcome back, {user.fname}.</h1>
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
                  <span class="form-text fs-6"
                    >Aiport must be an ICAO code.</span
                  >
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
                  <span class="form-text fs-6"
                    >Aiport must be an ICAO code.</span
                  >
                </div>
                <div class="col-md-6 col-xl-3 mb-3">
                  <label for="depdate" class="form-label"
                    >Date of Departure</label
                  >
                  <div class="input-group">
                    <button
                      class="input-group-text btn btn-secondary"
                      type="button"
                      disabled={depDateStr == dateToStr()}
                      on:click={() => (depDateStr = dateToStr())}>Today</button
                    >
                    <input
                      type="date"
                      id="depdate"
                      class="form-control"
                      bind:value={depDateStr}
                    />
                  </div>
                </div>
                <div class="col-md-6 col-xl-3 mb-3">
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
                <div class="col-md-6 col-xl-3 mb-3">
                  <label for="desdate" class="form-label">Date of Arrival</label
                  >
                  <div class="input-group">
                    <button
                      class="input-group-text btn btn-secondary"
                      class:disabled={depDateStr == desDateStr}
                      type="button"
                      on:click={() => (depSync = true)}>Sync</button
                    >
                    <input
                      type="date"
                      id="desdate"
                      class="form-control"
                      on:input={() => (depSync = false)}
                      bind:value={desDateStr}
                    />
                  </div>
                </div>
                <div class="col-md-6 col-xl-3 mb-3">
                  <label for="destime" class="form-label">Time of Arrival</label
                  >
                  <input
                    type="time"
                    id="destime"
                    class="form-control"
                    bind:value={desTimeStr}
                  />
                </div>
                <div class="col-md-6 col-xl-4 mb-3">
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
                <div class="col-md-6 col-xl-4 mb-3">
                  <label for="planemodel" class="form-label">Model</label>
                  <input
                    id="planemodel"
                    class="form-control"
                    bind:value={planeModel}
                    placeholder={'"Cessna 172"'}
                  />
                </div>
                <div class="col-md-6 col-xl-4 mb-3">
                  <label for="planeid" class="form-label">Identification</label>
                  <input
                    id="planeid"
                    class="form-control"
                    bind:value={planeId}
                    placeholder={'"4X-CHA"'}
                  />
                </div>
                <div class="col-12 mb-3">
                  <label for="notes" class="form-label">Notes</label>
                  <textarea
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
                disabled={inProgress}>Submit Flight</button
              >
            </div>
          </div>
        </form>
      {:else}
        <h1>User not logged in.</h1>
      {/if}
    {/await}
  </div>
</main>
<ToastSetup {toast} />

<style>
  textarea {
    resize: none;
  }
</style>
