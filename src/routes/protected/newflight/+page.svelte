<script>
  import {
    addParamsString,
    createToast,
    dateToStr,
    fetchFromEndpoint,
    getTimeStr,
    parseDateAndTime,
  } from "../../../hooks.client.js";
  import ToastSetup from "$lib/components/ToastSetup.svelte";
  import { oldHrefs } from "$lib/index.js";
  import logo from "$lib/images/logo_simplified.png";
  import FloatElement from "$lib/components/FloatElement.svelte";
  export let data;
  const { supabase, session, log, airplanes } = data;
  let { edit } = data;
  const apiRef = oldHrefs.apis;
  let toast;
  let dep = log ? log.dep.icao : "",
    des = log ? log.des.icao : "";
  let dateStr = log ? dateToStr(new Date(log.depDate)) : dateToStr();
  let depTimeStr = log ? getTimeStr(new Date(log.depDate)) : getTimeStr(),
    desTimeStr = log ? getTimeStr(new Date(log.desDate)) : getTimeStr();
  let plane = log ? log.plane : 1,
    planeId = log ? log.tail : "";
  let userNotes = log ? log.notes : "";
  let isPublic = log ? log.public : true;
  let inProgress = false,
    isComplete = false;
  const ogProgress = { message: "", value: 0 };
  let progress = ogProgress;
  let logId = NaN;
  $: planeId = planeId.toUpperCase();
  $: depDate = parseDateAndTime(dateStr, depTimeStr);
  async function getAirportDetails(airport = "") {
    return await fetchFromEndpoint(apiRef.airport.link, { airport });
  }
  async function submit() {
    if (!verify()) {
      return;
    }
    const tempDate = parseDateAndTime(dateStr, desTimeStr);
    const desDate =
      tempDate.valueOf() >= depDate.valueOf()
        ? tempDate
        : new Date(tempDate.valueOf() + 86400000);

    inProgress = true;
    progress = { message: "Fetching Departure Airport", value: 50 };
    const depAirport = await getAirportDetails(dep);
    if (depAirport.length != 1) {
      showError("Departure airport not found.");
      inProgress = false;
      progress = ogProgress;
      return;
    }
    progress = { message: "Fetching Destination Airport", value: 75 };
    const desAirport = await getAirportDetails(des);
    if (desAirport.length != 1) {
      showError("Destination airport not found");
      inProgress = false;
      progress = ogProgress;
      return;
    }
    progress = { message: "Inserting Into Database", value: 100 };
    const toInsert = {
      user_id: session.user.id,
      dep: depAirport[0],
      des: desAirport[0],
      depDate: depDate.toISOString(),
      desDate: desDate.toISOString(),
      plane: plane[0],
      tail: planeId,
      notes: userNotes,
      public: isPublic,
      plane_id: plane,
    };
    const { data, error } = edit
      ? await supabase.from("Logs").update(toInsert).eq("id", log.id).select()
      : await supabase.from("Logs").insert(toInsert).select();
    inProgress = false;
    progress = ogProgress;
    if (error) {
      showError(error.message);
      return;
    }
    logId = data[0].id;
    isComplete = true;
    dep = "";
    des = "";
    dateStr = dateToStr();
    depTimeStr = getTimeStr();
    desTimeStr = getTimeStr();
    planeId = "";
    userNotes = "";
  }
  function verify() {
    if (!dep || dep.length == 0) {
      showError("Airport of departure cannot be empty");
      return false;
    }
    if (!dep || des.length == 0) {
      showError("Airport of destination cannot be empty");
      return false;
    }
    if (planeId.length > 20) {
      showError("Tail Number cannot be more than 20 characters long.");
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
    {#if isComplete}
      <h1 class="text-success">Success!</h1>
      <h2>
        Your flight has been added to your <a href={oldHrefs.logbook.home.link}
          >logbook</a
        >.
      </h2>

      <div class="row my-4">
        <div class="col">
          <a
            href={addParamsString(oldHrefs.logbook.viewer.link, {
              logid: logId,
              ref: oldHrefs.newFlight.home.link,
            })}
            class="btn btn-primary btn-lg fs-2 w-100 h-100">View Flight</a
          >
        </div>
        <div class="col">
          <button
            on:click={() => {
              isComplete = false;
              edit = false;
            }}
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
        <h1>Welcome back.</h1>
      </div>
      <form on:submit|preventDefault={submit}>
        <div class="card">
          <div class="card-body fs-3">
            <div class="row">
              <div class="col-md-6 pb-3 text-nowrap">
                <label for="dep" class="form-label"
                  ><i class="fa-solid fa-plane-departure" /> Airport of Departure</label
                >
                <div class="input-group">
                  <input
                    type="text"
                    id="dep"
                    class="form-control"
                    bind:value={dep}
                    on:blur={() => {
                      dep = dep.trim();
                      if (dep.length == 3 || dep.length == 4)
                        dep = dep.toUpperCase();
                    }}
                    required
                  /><button
                    type="button"
                    class="input-group-text btn btn-secondary"
                    disabled={dep.trim().toLowerCase() ===
                      des.trim().toLowerCase() || inProgress}
                    on:click={() => {
                      const temp = dep;
                      dep = des;
                      des = temp;
                    }}><i class="fa-solid fa-right-left" /></button
                  >
                </div>
                <span class="form-text">Name, IATA, or ICAO code</span>
              </div>
              <div class="col-md-6 pb-3 text-nowrap">
                <label for="des" class="form-label"
                  ><i class="fa-solid fa-plane-arrival" /> Airport of Destination
                </label>
                <input
                  type="text"
                  id="des"
                  class="form-control"
                  bind:value={des}
                  on:blur={() => {
                    des = des.trim();
                    if (des.length == 3 || des.length == 4)
                      des = des.toUpperCase();
                  }}
                  required
                />
                <span class="form-text">Name, IATA, or ICAO code</span>
              </div>
              <div class="col-md-6 col-xl-4 pb-3 text-nowrap">
                <label for="depdate" class="form-label"
                  ><i class="fa-solid fa-calendar-days" /> Date</label
                >
                <div class="input-group">
                  <button
                    class="input-group-text btn btn-secondary"
                    type="button"
                    disabled={dateStr == dateToStr() || inProgress}
                    on:click={() => (dateStr = dateToStr())}>Today</button
                  >
                  <input
                    type="date"
                    id="depdate"
                    class="form-control"
                    bind:value={dateStr}
                    required
                    max="9999-12-31"
                  />
                </div>
              </div>
              <div class="col-md-6 col-xl-4 pb-3 text-nowrap">
                <label for="deptime" class="form-label"
                  ><i class="fa-solid fa-clock" /> Time of Departure</label
                >
                <div class="input-group">
                  <input
                    type="time"
                    id="deptime"
                    class="form-control"
                    bind:value={depTimeStr}
                    required
                  />
                  <button
                    type="button"
                    class="input-group-text btn btn-secondary"
                    disabled={depTimeStr === desTimeStr}
                    on:click={() => {
                      const temp = depTimeStr;
                      depTimeStr = desTimeStr;
                      desTimeStr = temp;
                    }}><i class="fa-solid fa-right-left" /></button
                  >
                </div>
                <div class="form-text">
                  Times are relative to your current time zone.
                </div>
              </div>

              <div class="col-md-6 col-xl-4 pb-3 text-nowrap">
                <label for="destime" class="form-label"
                  ><i class="fa-regular fa-clock" /> Time of Arrival</label
                >
                <input
                  type="time"
                  id="destime"
                  class="form-control"
                  bind:value={desTimeStr}
                  required
                />
              </div>

              <div class="col-md-6 pb-3 text-nowrap">
                <label for="airplane" class="form-label"
                  ><i class="fa-solid fa-globe" /> Aircraft</label
                >
                {#if airplanes.length > 0}
                  <select bind:value={plane} id="airplane" class="form-select">
                    {#each airplanes as airplane}
                      <option value={airplane.id}
                        >{airplane.make} {airplane.model}</option
                      >
                    {/each}
                  </select>
                {/if}
              </div>

              <div class="col-md-6 pb-3 text-nowrap">
                <label for="planeid" class="form-label"
                  ><i class="fa-solid fa-hashtag" /> Tail Number</label
                >
                <input
                  id="planeid"
                  class="form-control"
                  bind:value={planeId}
                  on:blur={() => (planeId = planeId.trim())}
                  placeholder={'"CHA"'}
                  maxlength="20"
                />
              </div>
              <div class="col-12 pb-3 text-nowrap">
                <label for="notes" class="form-label">Notes</label>
                <textarea
                  dir="auto"
                  id="notes"
                  rows="4"
                  class="form-control fs-5"
                  bind:value={userNotes}
                  on:blur={() => (userNotes = userNotes.trim())}
                  maxlength="10000"
                />
                <div
                  class="form-text"
                  class:text-danger={userNotes.length >= 9000}
                >
                  {`${userNotes.length.toLocaleString()}/${(10000).toLocaleString()}`}
                </div>
              </div>
              <div class="col-auto">
                <div class="form-check fs-4">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="ispublic"
                    bind:checked={isPublic}
                    disabled={inProgress}
                  /><label for="ispublic" class="form-check-label">Public</label
                  >
                </div>
                <div class="form-text">This can always be changed later.</div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            {#if inProgress}
              <div
                class="progress mb-2"
                role="progressbar"
                style="height: 40px"
              >
                <div
                  class="progress-bar progress-bar-striped progress-bar-animated"
                  style="width: {progress.value}%"
                >
                  {`${progress.value}%`}
                </div>
              </div>
              <div class="text-center font-google-quicksand fw-600 fst-italic">
                {progress.message}
              </div>
            {:else}
              <button
                class="btn btn-primary btn-lg w-100 fs-4"
                type="submit"
                disabled={inProgress}>Submit Flight</button
              >
            {/if}
          </div>
        </div>
      </form>
    {/if}
  </div>
</main>
<FloatElement visible={edit && !isComplete}>
  <div class="input-group shadow">
    <span class="input-group-text">Editing Log {log.id}</span>
    <a href={oldHrefs.logbook.home.link} class="btn btn-secondary"
      ><i class="fa-solid fa-arrow-left" /></a
    >
  </div>
</FloatElement>
<ToastSetup {toast} />

<style>
  textarea {
    resize: none;
  }

  img {
    max-height: 60vh;
  }
  div.text-nowrap {
    overflow: auto;
  }
</style>
