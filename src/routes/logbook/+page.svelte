<script>
  import { onMount } from "svelte";
  import {
    GetSortOrder,
    addParamsString,
    createToast,
    formatDate,
    formatDateStr,
    formatDuration,
    getTimeStr,
    maxLen,
  } from "../../hooks.client.js";
  import hrefs from "../../data/hrefs.json";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  import FloatElement from "../../components/FloatElement.svelte";
  import Modal from "../../components/Modal.svelte";
  export let data;
  const { session } = data;
  const user = session ? session.user : false;
  const { supabase } = data;
  const allLogs = data.logs;
  let toast;
  let inProgress = false;
  let delConfirm = false;
  let userLogs = [];
  let totalMinutes = 0;
  let currentFlight = { id: NaN, dep: {}, des: {}, time: "" };
  $: hours = Math.floor(totalMinutes / 60);
  $: minutes = totalMinutes % 60;
  onMount(() => {
    const userId = user.id;
    for (const i of allLogs) {
      if (i.user_id == userId) {
        userLogs.push(i);
        const minutes = calculateMinutes(
          new Date(i.depDate),
          new Date(i.desDate)
        );
        totalMinutes += minutes;
      }
    }
    userLogs.sort(GetSortOrder("depDate", true));
    userLogs = userLogs;
  });
  function toggleModal() {
    delConfirm = !delConfirm;
  }
  async function changeVisibility(id = "", makePublic = false) {
    for (const i in userLogs) {
      const current = userLogs[i];
      if (current.id === id) {
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
        userLogs[i].public = makePublic;
      }
    }
  }
  async function deleteFlight(id = "") {
    for (const i in userLogs) {
      const current = userLogs[i];
      if (current.id === id) {
        const userDetails = user;
        if (current.user_id !== userDetails.id) {
          toast = createToast("error", "Error", "Unauthorized");
          return;
        }
        inProgress = true;
        const { error } = await supabase.from("Logs").delete().eq("id", id);
        inProgress = false;
        if (error) {
          toast = createToast("error", "Error", error.message);
          return;
        }
        toast = createToast(
          "success",
          "Flight Deleted",
          "Your flight has been deleted from your logbook."
        );
        totalMinutes -= calculateMinutes(
          new Date(current.depDate),
          new Date(current.desDate)
        );
        userLogs.splice(i, 1);
        userLogs = userLogs;
      }
    }
    delConfirm = false;
  }
  function calculateMinutes(startDate = new Date(), endDate = new Date()) {
    const timeDifference = endDate.valueOf() - startDate.valueOf();
    const minutes = Math.floor(timeDifference / 60000);
    return minutes;
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
<main>
  <div class="container my-5 font-google-gabarito">
    {#if user}
      <div class="mb-3">
        <h1>
          Welcome to your <span class="text-aerologger">logbook</span>, {user
            .user_metadata.first_name}.
        </h1>
        <h3>
          Air time: <span class="text-aerologger"
            >{hours.toLocaleString()} hours and {minutes} minutes</span
          >
          <h4>
            Total flights: <span class="text-aerologger"
              >{userLogs.length.toLocaleString()}</span
            >
          </h4>
        </h3>
      </div>
      <div class="mb-3">
        <span class="font-reset fw-light fs-6"
          >Please note that date and times are relative to your time zone.</span
        >
      </div>
      <div class="table-responsive d-none d-md-block">
        <table class="table fs-5">
          <thead>
            <tr>
              <th scope="col" class="text-nowrap"
                ><i class="fa-solid fa-calendar-days" title="Flight Date" /> Date
              </th>
              <th scope="col" class="text-nowrap"
                ><i class="fa-solid fa-map" title="Flight Route" /> Route
              </th>
              <th scope="col" class="text-nowrap"
                ><i
                  class="fa-solid fa-clock"
                  title="Takeoff and Landing Times"
                /> Times
              </th>
              <th scope="col" class="text-nowrap"
                ><i class="fa-solid fa-hashtag" title="Tail Number" /> Tail Number</th
              >
              <th scope="col" class="text-nowrap">
                <i class="fa-solid fa-user" title="Publicity Status" /> Status
              </th>
              <th scope="col" class="text-nowrap"
                ><i class="fa-solid fa-circle-info" title="Flight Options" /> More
              </th>
            </tr>
          </thead>
          <tbody>
            {#each userLogs as log}
              <tr>
                <th scope="row">{formatDateStr(log.depDate)}</th>
                <td>{log.dep.icao} to {log.des.icao}</td>
                <td>
                  <div>
                    {getTimeStr(new Date(log.depDate))} to {getTimeStr(
                      new Date(log.desDate)
                    )}
                  </div>
                  <div class="fs-6">
                    ( {formatDuration(
                      new Date(log.depDate),
                      new Date(log.desDate)
                    )})
                  </div>
                </td>
                <td>{log.identification}</td>
                <td
                  ><select
                    class="form-select"
                    disabled={inProgress}
                    on:input={() => changeVisibility(log.id, !log.public)}
                    ><option selected={log.public}>Public</option>
                    <option selected={!log.public}>Private</option></select
                  ></td
                >
                <td>
                  <div class="btn-group">
                    <a
                      href={addParamsString(hrefs.logbook.viewer.link, {
                        logId: log.id,
                      })}
                      class="btn btn-secondary">View</a
                    >
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
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div class="fs-3 d-md-none">
        {#each userLogs as log}
          <div class="border-bottom mb-4">
            <div class="mb-3">
              <div class="fw-bold my-1">
                <i class="fa-solid fa-calendar-days" title="Flight Date" />
                {formatDateStr(log.depDate)}
              </div>
            </div>
            <div class="mb-3">
              <div>
                <i class="fa-solid fa-map" title="Flight Route" />
                {log.dep.icao} to {log.des.icao}
              </div>
            </div>
            <div class="mb-3">
              <i class="fa-solid fa-clock" title="Takeoff and Landing Times" />
              {getTimeStr(new Date(log.depDate))} to {getTimeStr(
                new Date(log.desDate)
              )}
            </div>
            <div class="mb-3">
              <i class="fa-solid fa-hashtag" title="Tail Number" />
              {log.identification}
            </div>
            <div class="mb-3 row">
              <div class="col-auto">
                <i class="fa-solid fa-user" title="Publicity Status" />
              </div>
              <div class="col">
                <select
                  class="form-select"
                  disabled={inProgress}
                  on:input={() => changeVisibility(log.id, !log.public)}
                  ><option selected={log.public}>Public</option>
                  <option selected={!log.public}>Private</option></select
                >
              </div>
            </div>
            <div class="mb-3 row">
              <div class="col-auto">
                <i class="fa-solid fa-circle-info" title="Flight Options" />
              </div>
              <div class="col">
                <div class="btn-group">
                  <a
                    href={addParamsString(hrefs.logbook.viewer.link, {
                      logId: log.id,
                    })}
                    class="btn btn-secondary">View</a
                  >
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
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
      <div class="my-3">
        <a href={hrefs.newFlight.home.link} class="btn btn-primary btn-lg w-100"
          >Log New Flight</a
        >
      </div>
    {:else}
      <h1>
        Please <a href={hrefs.login.home.link} class="text-reset">log in</a> to see
        your flights.
      </h1>
    {/if}
    <div />
  </div>
</main>
<ToastSetup {toast} />
<FloatElement
  ><a href={hrefs.logbook.settings.link} class="btn btn-dark btn-lg"
    ><i class="fa-solid fa-gear" /></a
  ></FloatElement
>

<style>
  table > thead > tr > th {
    overflow: auto;
  }
</style>
