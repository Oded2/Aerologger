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
  import Container from "$lib/components/Container.svelte";
  import Input from "$lib/components/Input.svelte";
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
  <Container>
    <div class="mb-5 text-center">
      <h1 class="text-4xl font-bold">
        Welcome back, <span class="text-primary">Pilot</span>.
      </h1>
    </div>
    <form
      class="card card-body shadow-2xl mx-auto max-w-2xl text-xl"
      on:submit|preventDefault={submit}
    >
      <div class="md:grid grid-cols-12 gap-4 px-5">
        <div class="col-span-6">
          <label for="dep" class="label">Departure Airport</label>
          <Input
            id="dep"
            placeholder="TLV"
            text={"Name, ICAO, or IATA code"}
            bind:value={dep}
            on:blur={() => {
              if (dep.length == 3 || dep.length == 4) dep = dep.toUpperCase();
            }}
          />
        </div>
        <div class="col-span-6">
          <label for="des" class="label">Destination Airport</label>
          <Input
            id="des"
            placeholder="ATL"
            bind:value={des}
            on:blur={() => {
              if (des.length == 3 || dep.length == 4) des = des.toUpperCase();
            }}
          />
        </div>
        <div class="col-span-4">
          <label for="date" class="label">Date</label>
          <Input type="date" id="date" bind:value={dateStr} />
        </div>
        <div class="col-span-4">
          <label for="depTime" class="label">Takeoff</label>
          <Input id="depTime" type="time" bind:value={depTimeStr} />
        </div>
        <div class="col-span-4">
          <label for="desTime" class="label">Landing</label>
          <Input
            id="desTime"
            type="time"
            bind:value={desTimeStr}
            text="Relative to the takeoff time zone"
          />
        </div>
      </div>
    </form>
  </Container>
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
