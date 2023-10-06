<script>
  import { onMount } from "svelte";
  import {
    addParamsString,
    createSbClient,
    createToast,
    formatDate,
    getTimeStr,
    getUserDetails,
    maxLen,
  } from "../../hooks.client.js";
  import hrefs from "../../data/hrefs.json";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  export let data;
  const api = data.sbApi;
  const sb = createSbClient(api);
  const user = getUserDetails(api);
  const allLogs = data.logs;
  let toast;
  let inProgress = false;
  let userLogs = [];
  let totalHours = 0,
    totalMinutes = 0;
  onMount(fetchLogs);
  async function fetchLogs() {
    const userDetails = await user;
    if (!userDetails) {
      return;
    }
    userLogs = [];
    const userId = userDetails.id;
    for (const i of allLogs) {
      if (i.owner === userId) {
        userLogs.push(i);
        userLogs = userLogs;
        const minutes = calculateMinutes(
          new Date(i.depDate),
          new Date(i.desDate)
        );
        totalMinutes += minutes;
      }
    }
    totalHours = Math.floor(totalMinutes / 60);
    totalMinutes %= 60;
  }
  function formatDateTime(string = "") {
    let date = new Date(string);
    return `${formatDate(date)} at ${getTimeStr(date)}`;
  }
  async function changeVisibility(id = "", makePublic = false) {
    for (const i in userLogs) {
      const current = userLogs[i];
      if (current.id === id) {
        inProgress = true;
        const { error } = await sb
          .from("Logs")
          .update({ public: makePublic })
          .eq("id", id);
        inProgress = false;
        if (error) {
          toast = createToast("error", "Error", error.message);
          return;
        }
        userLogs[i].public = makePublic;
      }
    }
  }
  function calculateMinutes(startDate = new Date(), endDate = new Date()) {
    const timeDifference = endDate.valueOf() - startDate.valueOf();
    const minutes = Math.floor(timeDifference / 60000);
    return minutes;
  }
</script>

<main>
  <div class="container my-5 font-google-gabarito">
    {#await user}
      <h1>Loading...</h1>
    {:then user}
      {#if user}
        <div class="mb-5">
          <h1>
            Welcome to your <span class="text-primary">logbook</span>, {user.fname}.
          </h1>
          <h3>
            Air time: <span class="text-primary"
              >{totalHours} hours and {totalMinutes} minutes</span
            >
          </h3>
        </div>
        <div class="fs-3">
          <div class="row border-bottom py-2 d-none d-md-flex">
            <div class="col-md-3 mb-3">
              <i class="fa-solid fa-plane-departure" /> Takeoff
            </div>
            <div class="col-md-3 mb-3">
              <i class="fa-solid fa-plane-arrival" /> Landing
            </div>
            <div class="col-md-3 mb-3">
              <i class="fa-solid fa-plane-circle-exclamation" /> Plane Information
            </div>
            <div class="col-md-3 mb-3">
              <i class="fa-solid fa-note-sticky" /> Notes
            </div>
          </div>
          <div class="border-bottom d-block d-md-none" />

          {#each userLogs as log}
            <div class="row py-2 border-bottom">
              <div class="col-md-3 mb-3">
                <div class="fw-bold d-md-none my-1">
                  <i class="fa-solid fa-plane-departure" /> Takeoff
                </div>
                <div>
                  <span class="text-primary">{log.dep}</span> at
                  {formatDateTime(log.depDate)}
                </div>
                <div />
              </div>
              <div class="col-md-3 mb-3">
                <div class="fw-bold d-md-none my-1">
                  <i class="fa-solid fa-plane-arrival" /> Landing
                </div>
                <div>
                  <span class="text-primary">{log.des}</span> at {formatDateTime(
                    log.desDate
                  )}
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="fw-bold d-md-none my-1">
                  <i class="fa-solid fa-plane-circle-exclamation" /> Plane Information
                </div>
                <div>
                  Type: <span class="text-capitalize">{log.type}</span>
                </div>
                <div>
                  Model: <span class="text-capitalize">{log.model}</span>
                </div>
                <div>
                  ID: <span class="text-uppercase">{log.identification}</span>
                </div>
                <div />
              </div>
              <div class="col-md-3 mb-3">
                <div class="fw-bold d-md-none my-1">
                  <i class="fa-solid fa-note-sticky" /> Notes
                </div>
                {maxLen(log.notes, 60)}
              </div>
              <div class="row my-1">
                <div class="col-auto justify-content-between">
                  <button
                    class="btn btn-outline-dark btn-lg mb-3"
                    on:click={() => changeVisibility(log.id, false)}
                    disabled={!log.public || inProgress}>Private</button
                  >
                </div>
                <div class="col-auto">
                  <button
                    class="btn btn-outline-dark btn-lg mb-3"
                    on:click={() => changeVisibility(log.id, true)}
                    disabled={log.public || inProgress}>Public</button
                  >
                </div>
                <div class="col-sm" />
                <div class="col-auto">
                  <a
                    href={addParamsString(hrefs.logbook.viewer.link, {
                      logId: log.id,
                    })}
                    class="btn btn-outline-primary btn-lg mb-3">Details</a
                  >
                </div>
              </div>
            </div>
          {/each}
          <div class="my-3">
            <a
              href={hrefs.newFlight.home.link}
              class="btn btn-primary btn-lg w-100">Log New Flight</a
            >
          </div>
        </div>
      {:else}
        <h1>
          Please <a href={hrefs.login.home.link} class="text-reset">log in</a> to
          see your flights.
        </h1>
      {/if}
    {/await}
    <div />
  </div>
</main>
<ToastSetup {toast} />
