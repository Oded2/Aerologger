<script>
  import { onMount } from "svelte";
  import {
    addParamsString,
    formatDate,
    getTimeStr,
    getUserDetails,
    maxLen,
  } from "../../hooks.client.js";
  import hrefs from "../../data/hrefs.json";
  export let data;
  const api = data.sbApi;
  const user = getUserDetails(api);
  const allLogs = data.logs;
  let userLogs = [];
  onMount(async () => {
    const userId = (await user).id;
    for (let i of allLogs) {
      if (i["owner"] === userId) {
        userLogs.push(i);
        userLogs = userLogs;
      }
    }
  });
  function formatDateTime(string = "") {
    let date = new Date(string);
    return `${formatDate(date)} at ${getTimeStr(date)}`;
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
            Welcome to your <span class="text-primary">flight log</span>, {user.fname}.
          </h1>
        </div>
        <div class="fs-3">
          <div class="row border-bottom py-2">
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

          {#each userLogs as log}
            <div class="row py-2 border-bottom hover-row">
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
              <div class="d-flex justify-content-end my-1">
                <a
                  href={addParamsString(hrefs.logbook.viewer.link, {
                    logId: log.id,
                  })}
                  class="btn btn-outline-primary btn-lg">More Details</a
                >
              </div>
            </div>
          {/each}
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

<style>
  div.hover-row {
    transition: 0.5s;
  }
  div.hover-row:hover {
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
  }
</style>
