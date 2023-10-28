<script>
  import Modal from "./Modal.svelte";
  import {
    addParamsString,
    formatDateStr,
    formatDuration,
    getTimeStr,
    createToast,
    GetSortOrder,
    calculateMinutes,
  } from "../hooks.client.js";
  import hrefs from "../data/hrefs.json";
  import { page } from "$app/stores";
  import { createEventDispatcher } from "svelte";
  export let logs = [];
  export let supabase;
  export let allowModification = true;
  const maxLogs = 10;
  const maxPage = parseInt(
    logs.length / maxLogs + (logs.length % maxLogs != 0 ? 1 : 0)
  );
  let currentPage = 1;
  let userPage = currentPage;
  const dispatch = createEventDispatcher();
  const refUrl = $page.url.href;
  let inProgress = false,
    delConfirm = false;
  let currentFlight = { id: NaN, dep: {}, des: {}, time: "" };
  let totalMinutes = 0,
    totalFlights = 0;
  logs.sort(GetSortOrder("depDate", true));
  $: hours = Math.floor(totalMinutes / 60);
  $: minutes = totalMinutes % 60;
  for (const i of logs) {
    totalFlights++;
    totalMinutes += calculateMinutes(new Date(i.depDate), new Date(i.desDate));
  }
  async function changeVisibility(id = "", makePublic = false) {
    inProgress = true;
    const { error } = await supabase
      .from("Logs")
      .update({ public: makePublic })
      .eq("id", id);
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    for (const i in logs) {
      if (logs[i].id === id) {
        logs[i].public = makePublic;
      }
    }
  }
  function toggleModal() {
    delConfirm = !delConfirm;
  }
  async function deleteFlight(id = "") {
    for (const i in logs) {
      const current = logs[i];
      if (current.id === id) {
        inProgress = true;
        const { error } = await supabase.from("Logs").delete().eq("id", id);
        inProgress = false;
        if (error) {
          toast = createToast("error", "Error", error.message);
          return;
        }
        totalMinutes -= calculateMinutes(
          new Date(current.depDate),
          new Date(current.desDate)
        );
        totalFlights--;
        logs.splice(i, 1);
        logs = logs;
        dispatch("delete");
      }
    }
    delConfirm = false;
  }
</script>

<Modal showModal={delConfirm} on:click={toggleModal}>
  <div class="font-google-quicksand">
    <div class="text-center">
      <h1>Are you sure you want to delete this flight?</h1>
      <h4>This action cannot be undone.</h4>
      <div class="mt-4">
        <h2>Flight Info</h2>
        <h3>
          <span class="fw-bold">{currentFlight.dep.city}</span> to
          <span class="fw-bold">{currentFlight.des.city}</span>;
          <span class="fw-bold">{currentFlight.time}</span>
        </h3>
      </div>
    </div>

    <div class="row mt-5 pt-5">
      <div class="col-sm mb-2 mb-sm-0">
        <button
          class="btn btn-primary btn-lg w-100 fw-bold h-100"
          on:click={toggleModal}>Cancel</button
        >
      </div>
      <div class="col-sm">
        <button
          class="btn btn-danger btn-lg w-100 fw-bold h-100"
          disabled={inProgress}
          on:click={() => deleteFlight(currentFlight.id)}>Delete Flight</button
        >
      </div>
    </div>
  </div>
</Modal>
<div class="container font-google-gabarito">
  <div class="mb-3">
    <h3>
      Air time: <span class="text-aerologger"
        >{hours.toLocaleString()} hours and {minutes} minutes</span
      >
    </h3>
    <h4>
      Total flights: <span class="text-aerologger"
        >{totalFlights.toLocaleString()}</span
      >
    </h4>
  </div>
  <div class="mb-3">
    <span class="font-reset fw-light fs-6"
      >Please note that date and times are relative to your time zone.</span
    >
  </div>
  {#if logs.length > maxLogs}
    <div class="mb-3">
      <div>
        Page {currentPage}
      </div>
      <div class="mb-1">
        <button
          class="btn btn-secondary btn-sm"
          on:click={() => currentPage--}
          disabled={currentPage == 1}>Back</button
        >
        <button
          class="btn btn-secondary btn-sm"
          on:click={() => currentPage++}
          disabled={logs.length / currentPage <= maxLogs}>Next</button
        >
      </div>
      <form
        on:submit|preventDefault={() => {
          currentPage = userPage;
        }}
      >
        <div class="input-group mw-custom">
          <span class="input-group-text">Skip to Page</span>
          <input
            type="number"
            class="form-control"
            bind:value={userPage}
            min={1}
            max={maxPage}
          />
          <button
            type="submit"
            class="btn btn-primary input-group-text"
            on:click={() => (currentPage = userPage)}
            disabled={userPage == currentPage ||
              !userPage ||
              userPage > maxPage}
          >
            <i class="fa-solid fa-check" />
          </button>
        </div>
      </form>
    </div>
  {/if}
  <div class="fs-5">
    <div class="row p-2 mb-2 border-bottom d-none d-md-flex">
      <div class="col-md mb-2 mb-md-0 fw-bold">
        <i class="fa-solid fa-calendar-days" title="Flight Date" /> Date
      </div>
      <div class="col-md mb-2 mb-md-0 fw-bold">
        <i class="fa-solid fa-map" title="Flight Route" /> Route
      </div>
      <div class="col-md mb-2 mb-md-0 fw-bold">
        <i class="fa-solid fa-clock" title="Takeoff and Landing Times" />
        Times
      </div>
      <div class="col-md mb-2 mb-md-0 fw-bold">
        <i class="fa-solid fa-hashtag" title="Tail Number" /> Tail Number
      </div>
      {#if allowModification}
        <div class="col-md mb-2 mb-md-0 fw-bold">
          <i class="fa-solid fa-user" title="Publicity Status" /> Status
        </div>
      {/if}
      <div class="col-md mb-2 mb-md-0 fw-bold">
        <i class="fa-solid fa-circle-info" title="Flight Options" /> More
      </div>
    </div>
    {#each logs as log, index}
      {#if index < currentPage * maxLogs && index >= currentPage * maxLogs - maxLogs}
        <div class="row mb-3 border-bottom">
          <div class="col-md mb-2 mb-md-0 fw-bold">
            <div>
              <i
                class="d-md-none fa-solid fa-calendar-days"
                title="Flight Date"
              />
              {formatDateStr(log.depDate)}
            </div>
            <div class="fs-6 fw-normal">ID: {log.id}</div>
          </div>
          <div class="col-md mb-2 mb-md-0">
            <i class="d-md-none fa-solid fa-map" title="Flight Route" />
            {log.dep.icao} to {log.des.icao}
          </div>
          <div class="col-md mb-2 mb-md-0">
            <div>
              <i
                class="d-md-none fa-solid fa-clock"
                title="Takeoff and Landing Times"
              />
              {getTimeStr(new Date(log.depDate))} to {getTimeStr(
                new Date(log.desDate)
              )}
            </div>
            <div class="fs-6">
              {`(${formatDuration(
                new Date(log.depDate),
                new Date(log.desDate)
              )})`}
            </div>
          </div>
          <div class="col-md mb-2 mb-md-0">
            <i class="d-md-none fa-solid fa-hashtag" title="Tail Number" />
            {log.identification}
          </div>
          {#if allowModification}
            <div class="col-md mb-2 mb-md-0">
              <div class="row">
                <div class="col-auto d-md-none">
                  <i class=" fa-solid fa-user" title="Publicity Status" />
                </div>
                <div class="col col-md-12 px-md-0">
                  <select
                    class="form-select"
                    disabled={inProgress || !allowModification}
                    on:input={() => changeVisibility(log.id, !log.public)}
                    ><option selected={log.public}>Public</option>
                    <option selected={!log.public}>Private</option></select
                  >
                </div>
              </div>
            </div>
          {/if}
          <div class="col-md mb-2 mb-md-0">
            <div class="row">
              <div class="col-auto">
                <i
                  class="d-md-none fa-solid fa-circle-info"
                  title="Flight Options"
                />
              </div>
              <div class="col">
                <div class="btn-group">
                  <a
                    href={addParamsString(hrefs.logbook.viewer.link, {
                      logId: log.id,
                      ref: refUrl,
                    })}
                    class="btn btn-secondary">View</a
                  >
                  {#if allowModification}
                    <button
                      type="button"
                      class="btn btn-secondary dropdown-toggle dropdown-toggle-split"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      disabled={inProgress}
                    >
                      <span class="visually-hidden">Toggle Dropdown</span>
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <a
                          href={addParamsString(hrefs.newFlight.home.link, {
                            logId: log.id,
                          })}
                          class="btn btn-info dropdown-item">Edit Flight</a
                        >
                      </li>
                      <li>
                        <button
                          class="btn btn-danger dropdown-item"
                          on:click={() => {
                            currentFlight.id = log.id;
                            currentFlight.dep = log.dep;
                            currentFlight.des = log.des;
                            currentFlight.time = formatDuration(
                              new Date(log.depDate),
                              new Date(log.desDate)
                            );
                            toggleModal();
                          }}>Delete Flight</button
                        >
                      </li>
                    </ul>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  div.mw-custom {
    max-width: 250px;
  }
</style>
