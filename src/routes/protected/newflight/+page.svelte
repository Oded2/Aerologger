<script>
  import {
    addParamsString,
    createToast,
    dateToStr,
    fetchFromEndpoint,
    getTimeStr,
    parseDateAndTime,
  } from "../../../hooks.client.js";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  import Switch from "../../../components/Switch.svelte";
  import hrefs from "../../../data/hrefs.json";
  import logo from "../../../data/images/logo_simplified.png";
  import { goto } from "$app/navigation";
  import FloatElement from "../../../components/FloatElement.svelte";
  export let data;
  const { supabase, session, log } = data;
  let { logId } = data;
  const apiRef = hrefs.apis;
  let toast;
  let dep = log ? log.dep.icao : "",
    des = log ? log.des.icao : "";
  let dateStr = log ? dateToStr(new Date(log.depDate)) : dateToStr();
  let depTimeStr = log ? getTimeStr(new Date(log.depDate)) : getTimeStr(),
    desTimeStr = log ? getTimeStr(new Date(log.desDate)) : getTimeStr();
  let planeType = log ? log.type : "airplane",
    planeManu = log ? log.plane.manufacturer : "",
    planeModel = log ? log.plane.model : "",
    planeId = log ? log.identification : "";
  let userNotes = log ? log.notes : "";
  let isPublic = log ? log.public : true;
  let inProgress = false,
    isComplete = false;
  let submitText = "Submit Flight";
  $: submitText = inProgress ? submitText : "Submit Flight";
  let logNumber = NaN;
  $: planeId = planeId.toUpperCase();
  $: depDate = parseDateAndTime(dateStr, depTimeStr);
  async function getAirportDetails(airport = "") {
    return await fetchFromEndpoint(apiRef.airport.link, { airport });
  }
  async function fetchPlane() {
    return await fetchFromEndpoint(apiRef.airplane.link, {
      type: planeType,
      manu: planeManu,
      model: planeModel,
    });
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
    if (planeType !== "other") submitText = "Fetching Aircraft";
    const plane =
      planeType === "other"
        ? [{ manufacturer: planeManu, model: planeModel }]
        : await fetchPlane();
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
    const toInsert = {
      user_id: session.user.id,
      dep: depAirport[0],
      des: desAirport[0],
      depDate: depDate.toISOString(),
      desDate: desDate.toISOString(),
      type: planeType,
      plane: plane[0],
      identification: planeId,
      notes: userNotes,
      public: isPublic,
    };
    const { data, error } = logId
      ? await supabase.from("Logs").update(toInsert).eq("id", logId)
      : await supabase.from("Logs").insert(toInsert).select();
    inProgress = false;
    logNumber = data ? data[0].id : logId;
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
              ref: hrefs.newFlight.home.link,
            })}
            class="btn btn-primary btn-lg fs-2 w-100 h-100">View Flight</a
          >
        </div>
        <div class="col">
          <button
            on:click={() => {
              isComplete = false;
              if (logId) goto(hrefs.newFlight.home.link);
              logId = null;
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
                <input
                  type="text"
                  id="dep"
                  class="form-control"
                  bind:value={dep}
                  on:blur={() => {
                    if (dep.length == 3 || dep.length == 4)
                      dep = dep.toUpperCase();
                  }}
                  required
                />
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
                    disabled={dateStr == dateToStr()}
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

                <input
                  type="time"
                  id="deptime"
                  class="form-control"
                  bind:value={depTimeStr}
                  required
                />
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

              <div class="col-md-6 col-xl-3 pb-3 text-nowrap">
                <label for="planemanu" class="form-label"
                  ><i class="fa-solid fa-globe" /> Aircraft Manufacturer</label
                >
                <input
                  id="planemanu"
                  class="form-control"
                  bind:value={planeManu}
                  placeholder={'"Cessna"'}
                  required
                />
              </div>
              <div class="col-md-6 col-xl-3 pb-3 text-nowrap">
                <label for="planemodel" class="form-label"
                  ><i class="fa-solid fa-plane-circle-exclamation" /> Aircraft Model</label
                >
                <input
                  id="planemodel"
                  class="form-control"
                  bind:value={planeModel}
                  placeholder={'"172"'}
                  required
                />
              </div>

              <div class="col-md-6 col-xl-3 pb-3 text-nowrap">
                <label for="planeid" class="form-label"
                  ><i class="fa-solid fa-hashtag" /> Tail Number</label
                >
                <input
                  id="planeid"
                  class="form-control"
                  bind:value={planeId}
                  placeholder={'"4X-CHA"'}
                />
              </div>
              <div class="col-md-12 col-xl-3 pb-3 text-nowrap">
                <label for="planetype" class="form-label"
                  ><i class="fa-solid fa-plane" /> Aircraft Type</label
                >
                <select
                  id="planetype"
                  class="form-select"
                  bind:value={planeType}
                  required
                >
                  <option value="airplane" selected>Airplane</option>
                  <option value="helicopter">Helicopter</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="col-12 pb-3 text-nowrap">
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
  </div>
</main>
<FloatElement visible={logId}>
  <div class="input-group shadow">
    <span class="input-group-text">Editing Log {logId}</span>
    <a href={hrefs.logbook.home.link} class="btn btn-secondary"
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
