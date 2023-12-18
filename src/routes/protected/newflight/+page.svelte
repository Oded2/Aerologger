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
  import { hrefs, oldHrefs } from "$lib/index.js";
  import logo from "$lib/images/logo_simplified.png";
  import FloatElement from "$lib/components/FloatElement.svelte";
  import Container from "$lib/components/Container.svelte";
  import FormInput from "$lib/components/FormInput.svelte";
  import Card from "$lib/components/Card.svelte";
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
  let plane = log ? log.plane_id : 1,
    tailNum = log ? log.tail : "";
  let userNotes = log ? log.notes : "";
  let isPublic = log ? log.public : true;
  let inProgress = false,
    isComplete = false;
  const ogProgress = { message: "", value: 0 };
  let progress = ogProgress;
  let logId = NaN;
  $: tailNum = tailNum.toUpperCase();
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
      tail: tailNum,
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
    resetValues();
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
    if (tailNum.length > 20) {
      showError("Tail Number cannot be more than 20 characters long.");
      return false;
    }
    if (isNaN(depDate.valueOf())) {
      showError("Date or time is invalid");
      return false;
    }
    return true;
  }
  function resetValues() {
    logId = data[0].id;
    isComplete = true;
    dep = "";
    des = "";
    dateStr = dateToStr();
    depTimeStr = getTimeStr();
    desTimeStr = getTimeStr();
    tailNum = "";
    userNotes = "";
  }
  function showError(desc) {
    toast = createToast("error", "Error", desc);
  }
</script>

<main>
  <Container>
    {#if isComplete}
      <Card
        imgBottom
        imgUrl={logo}
        title="Thank you for logging with Aerologger!"
        hello="card mx-auto w-96 shadow-2xl"
        actions={false}
        marginAuto
        ><p>
          Your flight is now ready in your <a
            class="link"
            href={hrefs.logbook.link}>logbook</a
          >.
        </p>
        <div class="card-actions justify-end mt-5">
          <button
            on:click={() => {
              edit = false;
              isComplete = false;
            }}
            class="btn btn-secondary">Log New Flight</button
          >
          <a
            href={addParamsString(hrefs.viewer.link, {
              logid: logId,
              ref: hrefs.newflight.link,
            })}
            class="btn btn-primary">View Flight</a
          >
        </div>
      </Card>
    {:else}
      <div class="mb-5 text-center">
        <h1 class="text-4xl font-bold">
          Welcome back, <span class="text-primary">Pilot</span>.
        </h1>
      </div>
      <Card
        marginAuto
        defaultWidth={false}
        largeShadow
        resetButton
        buttonText="Submit"
        on:submit={submit}
        on:reset={resetValues}
        disabled={inProgress}
      >
        <div class="grid md:grid-cols-2 gap-4 text-xl">
          <div class="grid md:grid-cols-12 gap-4">
            <div class="col-span-6">
              <label for="dep" class="label">Departure Airport</label>
              <div class="join w-full">
                <FormInput
                  maxWidth={false}
                  id="dep"
                  placeholder="TLV"
                  text={"Name, ICAO, or IATA code"}
                  joinItem
                  bind:value={dep}
                  on:blur={() => {
                    if (dep.length == 3 || dep.length == 4)
                      dep = dep.toUpperCase();
                  }}
                />
                <button
                  type="button"
                  class="btn btn-secondary join-item"
                  on:click={() => {
                    const temp = dep;
                    dep = des;
                    des = temp;
                  }}><i class="fa-solid fa-right-left"></i></button
                >
              </div>
            </div>
            <div class="col-span-6">
              <label for="des" class="label">Destination Airport</label>
              <FormInput
                maxWidth={false}
                id="des"
                placeholder="ATL"
                bind:value={des}
                on:blur={() => {
                  if (des.length == 3 || des.length == 4)
                    des = des.toUpperCase();
                }}
              />
            </div>
            <div class="col-span-4">
              <label for="date" class="label">Date</label>
              <FormInput
                maxWidth={false}
                type="date"
                id="date"
                max="9999-12-31"
                bind:value={dateStr}
              />
            </div>
            <div class="col-span-4">
              <label for="depTime" class="label">Takeoff</label>
              <FormInput
                maxWidth={false}
                id="depTime"
                type="time"
                bind:value={depTimeStr}
              />
            </div>
            <div class="col-span-4">
              <label for="desTime" class="label">Landing</label>
              <FormInput
                maxWidth={false}
                id="desTime"
                type="time"
                bind:value={desTimeStr}
                text="Relative to the takeoff time zone"
              />
            </div>
            <div class="col-span-6">
              <label for="aircraft" class="label">Aircraft</label>
              <FormInput
                type="select"
                id="aircraft"
                maxWidth={false}
                bind:value={plane}
              >
                {#each airplanes as airplane}
                  <option value={airplane.id}
                    >{airplane.make} {airplane.model}</option
                  >
                {/each}
              </FormInput>
            </div>
            <div class="col-span-6">
              <label for="tail" class="label">Tail Number</label>
              <FormInput
                maxWidth={false}
                id="tail"
                max="20"
                bind:value={tailNum}
                placeholder={'"CHA"'}
              />
            </div>
          </div>
          <div>
            <label for="notes" class="label">Notes</label>
            <FormInput
              maxWidth={false}
              id="notes"
              type="textarea"
              bind:value={userNotes}
              text={`${userNotes.length}/${(10000).toLocaleString()}`}
            />
            <FormInput
              maxWidth={false}
              type="checkbox"
              bind:value={isPublic}
              disabled={inProgress}
              text="Public"
            ></FormInput>
          </div>
        </div>
      </Card>
    {/if}
  </Container>
</main>
<FloatElement visible={edit && !isComplete}>
  <div class="join shadow bg-base-100">
    <div class="join-item flex justify-center items-center px-5">
      Editing Log {log.id}
    </div>

    <a href={hrefs.logbook.link} class="btn btn-secondary join-item"
      ><i class="fa-solid fa-arrow-left" /></a
    >
  </div>
</FloatElement>
<ToastSetup {toast} />
