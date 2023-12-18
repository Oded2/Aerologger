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
    formatDateTime,
  } from "../../hooks.client.js";
  import { hrefs } from "$lib/index.js";
  import { page } from "$app/stores";
  import ToastSetup from "./ToastSetup.svelte";
  import { supabase as supabaseClient } from "$lib/index.js";
  import Dropdown from "./Dropdown.svelte";
  import FormInput from "./FormInput.svelte";
  import Card from "./Card.svelte";
  import LogbookSettingGroup from "./LogbookSettingGroup.svelte";
  export let logs = [];
  export let allowModification = true;
  export let supabase = supabaseClient;
  export let userId = "";
  const refUrl = $page.url.href;
  const maxLogs = 12;
  const pageBreakpoint = 5;
  const maxPage = parseInt(
    logs.length / maxLogs + (logs.length % maxLogs != 0 ? 1 : 0)
  );
  let toast;
  let currentPage = 1;
  let userPage = currentPage;
  let sortby = "depDate";
  let reversed = false;
  let showDateLogged = false;
  let inProgress = false,
    delConfirm = false;
  let currentFlight = { id: NaN, dep: {}, des: {}, time: "" };
  let totalMinutes = 0,
    totalFlights = 0;
  logs.sort(GetSortOrder(sortby, true));
  $: hours = Math.floor(totalMinutes / 60);
  $: minutes = totalMinutes % 60;
  $: divider = parseInt((currentPage - 1) / pageBreakpoint) * pageBreakpoint;
  for (const i of logs) {
    totalFlights++;
    totalMinutes += calculateMinutes(new Date(i.depDate), new Date(i.desDate));
  }
  async function changeMassVisibility(toPublic = true) {
    if (
      !confirm(
        `This action will make all your logs ${
          toPublic ? "public" : "private"
        }. Are you sure you want to do this?`
      )
    )
      return;

    inProgress = true;
    const { error } = await supabase
      .from("Logs")
      .update({ public: toPublic })
      .eq("user_id", userId);
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    for (const i in logs) logs[i].public = toPublic;

    toast = createToast(
      "success",
      "Success",
      `All your logs are now ${toPublic ? "public" : "private"}`
    );
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
    for (const i in logs) if (logs[i].id === id) logs[i].public = makePublic;
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
        toast = createToast(
          "success",
          "Flight Deleted",
          "Your flight has been deleted from your logbook."
        );
      }
    }
    delConfirm = false;
  }
  async function purge() {
    if (
      !confirm(
        "Are you sure you want to purge your logbook? This action will delete ALL your flight logs and CANNOT be undone."
      )
    )
      return;

    inProgress = true;
    const { error } = await supabase
      .from("Logs")
      .delete()
      .eq("user_id", userId);
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    logs = [];
    totalFlights = 0;
    totalMinutes = 0;
    toast = createToast(
      "success",
      "Success",
      "All your logs have been deleted from your logbook"
    );
  }
  async function purgePublic(isPublic = false) {
    if (
      !confirm(
        `This action will delete ALL of your ${
          isPublic ? "public" : "private"
        } logs. This action cannot be undone.`
      )
    )
      return;
    inProgress = true;
    const { error } = await supabase
      .from("Logs")
      .delete()
      .eq("public", isPublic)
      .eq("user_id", userId);
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    for (const i in logs)
      if (logs[i].public == isPublic) {
        totalFlights--;
        totalMinutes -= calculateMinutes(
          new Date(logs[i].depDate),
          new Date(logs[i].desDate)
        );
        logs.splice(i, 1);
      }
    logs = logs;
    toast = createToast(
      "success",
      "Success",
      `All ${
        isPublic ? "public" : "private"
      } logs are deleted from your logbook.`
    );
  }
</script>

<div>
  <div class="mb-5 text-xl text-center md:text-start">
    <h3>
      Air Time: <span class="font-bold"
        >{hours.toLocaleString()} hours and {minutes} minutes</span
      >
    </h3>
    <h3>
      Total Flights: <span class="font-bold"
        >{totalFlights.toLocaleString()}</span
      >
    </h3>
    <h5 class="text-base">
      Please note that date and times are relative to your time zone.
    </h5>
  </div>
  <div class="mb-5 max-w-xs">
    <label class="form-control w-full">
      <div class="label">
        <span class="label-text text-lg font-semibold">Sort By</span>
      </div>
      <select
        class="select select-bordered"
        bind:value={sortby}
        on:change={() => {
          sortby === "created_at"
            ? (showDateLogged = true)
            : (showDateLogged = false);
          logs.sort(GetSortOrder(sortby, !reversed));
          logs = logs;
        }}
        ><option value="depDate">Flight Date</option>
        <option value="created_at">Date Logged</option>
      </select>
    </label>
    <FormInput
      type="checkbox"
      bind:value={reversed}
      on:input={() => (logs = logs.reverse())}
      text="Reverse Order"
    ></FormInput>
    <FormInput
      type="checkbox"
      bind:value={showDateLogged}
      text="Show Date Logged"
    ></FormInput>
  </div>
  {#if logs.length > maxLogs}
    <div class="mb-5">
      <div class="mb-1">Total Pages: {maxPage}</div>
      <div class="mb-3">
        <form on:submit|preventDefault={() => (currentPage = userPage)}>
          <label for="pageSkip" class="label">Go to Page</label>
          <div class="join">
            <FormInput
              id="pageSkip"
              bind:value={userPage}
              min="1"
              max={maxPage}
              required
              joinItem
            ></FormInput>
            <button
              type="submit"
              class="join-item btn btn-primary"
              disabled={userPage < 1 ||
                userPage > maxPage ||
                isNaN(userPage) ||
                currentPage == userPage}><i class="fa-solid fa-check" /></button
            >
          </div>
        </form>
      </div>
      <div class="mb-7">
        <div class="join">
          <button
            class="join-item btn btn-primary"
            on:click={() => {
              if (currentPage != 1) currentPage--;
            }}>&laquo;</button
          >
          {#each { length: maxPage + (maxPage > pageBreakpoint ? pageBreakpoint % maxPage : 0) } as _, index}
            {#if divider + pageBreakpoint >= index + 1 && index + 1 > divider}
              <button
                class="join-item btn btn-primary"
                class:btn-active={index + 1 == currentPage}
                disabled={index + 1 > maxPage}
                on:click={() => (currentPage = index + 1)}
                >{index + 1 <= maxPage ? index + 1 : "-"}
              </button>
            {/if}
          {/each}
          <button
            class="join-item btn btn-primary"
            on:click={() => {
              if (currentPage != maxPage) currentPage++;
            }}>&raquo;</button
          >
        </div>
      </div>
    </div>
  {/if}
  <div class="mb-10">
    <div
      class="grid-cols-5 gap-4 text-xl hidden md:grid border-b pb-4 border-secondary"
    >
      <div class="font-bold">
        <i class="fa-solid fa-calendar-days" title="Flight Date" /> Date
      </div>
      <div class="font-bold">
        <i class="fa-solid fa-map" title="Flight Route" /> Route
      </div>
      <div class="font-bold">
        <i class="fa-solid fa-clock" title="Takeoff and Landing Times" />
        Times
      </div>
      <div class="font-bold">
        <i class="fa-solid fa-hashtag" title="Tail Number" /> Tail Number
      </div>
      <div class="font-bold">
        <i class="fa-solid fa-circle-info" title="Flight Options" /> More
      </div>
    </div>
    {#each logs as log, index}
      {#if index < currentPage * maxLogs && index >= currentPage * maxLogs - maxLogs}
        <div
          class="grid md:grid-cols-5 gap-4 py-3 border-b border-secondary text-lg"
        >
          <div>
            <i
              class="md:hidden fa-solid fa-calendar-days"
              title="Flight Date"
            />
            <span class="font-bold"> {formatDateStr(log.depDate)}</span>
            <br />
            <span class="text-base">ID: {log.id}</span>
            {#if showDateLogged}
              <div class="text-base">
                Logged: {formatDateTime(new Date(log.created_at))}
              </div>
            {/if}
          </div>
          <div>
            <i class="md:hidden fa-solid fa-map" title="Flight Route" />
            {log.dep.icao} to {log.des.icao}
          </div>
          <div>
            <i
              class="md:hidden fa-solid fa-clock"
              title="Takeoff and Landing Times"
            />
            {getTimeStr(new Date(log.depDate))} to {getTimeStr(
              new Date(log.desDate)
            )}
            <br />
            {`(${formatDuration(
              new Date(log.depDate),
              new Date(log.desDate)
            )})`}
          </div>
          <div>
            <i class="md:hidden fa-solid fa-hashtag" title="Tail Number" />
            {log.tail}
          </div>
          <div>
            <div class="join">
              <a
                href={addParamsString(hrefs.viewer.link, {
                  logid: log.id,
                  ref: refUrl,
                })}
                class="btn btn-secondary join-item">View</a
              >
              <Dropdown className="btn btn-secondary join-item">
                <li>
                  <a
                    class="disabled"
                    href={addParamsString(hrefs.newflight.link, {
                      preset: log.id,
                    })}>Preset Flight</a
                  >
                </li>
                {#if allowModification}
                  <li>
                    <a
                      href={addParamsString(hrefs.newflight.link, {
                        preset: log.id,
                        edit: true,
                      })}>Edit Flight</a
                    >
                  </li>
                  <li class="border-b sm:hover:bg-error-content">
                    <button
                      onclick="delModal.showModal()"
                      on:click={() => {
                        currentFlight.id = log.id;
                        currentFlight.dep = log.dep;
                        currentFlight.des = log.des;
                        currentFlight.time = formatDuration(
                          new Date(log.depDate),
                          new Date(log.desDate)
                        );
                      }}>Delete Flight</button
                    >
                  </li>
                  <li>
                    <a
                      href="data:text/json;charset=utf-8,{JSON.stringify(log)}"
                      download={`log ${log.id}.json`}>Export Flight as JSON</a
                    >
                  </li>
                {/if}
              </Dropdown>
              {#if allowModification}
                <button
                  class="join-item"
                  disabled={inProgress}
                  on:click={() => changeVisibility(log.id, !log.public)}
                >
                  <i
                    class="fa-solid ps-3 text-2xl"
                    class:fa-lock={!log.public}
                    class:fa-lock-open={log.public}
                    title={log.public
                      ? "This log is public"
                      : "This log is private"}
                  ></i></button
                >
              {/if}
            </div>
          </div>
        </div>
      {/if}
    {/each}
  </div>

  {#if logs.length > 0}
    <div class="my-5">
      <Card
        title="Logbook Settings"
        marginAuto
        actions={false}
        defaultWidth={false}
      >
        <div class="grid md:grid-flow-col gap-4">
          <LogbookSettingGroup
            title="Options"
            className="btn-secondary"
            href="data:text/json;charset=utf-8,{JSON.stringify(logs)}"
          >
            <a
              class="btn btn-secondary col-span-full"
              class:disabled={inProgress}
              href="data:text/json;charset=utf-8,{JSON.stringify(logs)}"
              download="logbook.json">Export Logbook as JSON</a
            ></LogbookSettingGroup
          >

          {#if allowModification}
            <LogbookSettingGroup title="Privacy">
              <button
                class="btn btn-info col-span-6"
                on:click={() => changeMassVisibility(false)}
                disabled={inProgress}>Make Logs Private</button
              >

              <button
                class="btn btn-info col-span-6"
                on:click={() => changeMassVisibility(true)}
                disabled={inProgress}>Make Logs Public</button
              >
            </LogbookSettingGroup>
            <LogbookSettingGroup title="Danger Zone">
              <button
                class="btn btn-outline btn-error col-span-4"
                on:click={() => purgePublic(false)}
                disabled={inProgress}>Delete Private Logs</button
              >
              <button
                class="btn btn-outline btn-error col-span-4"
                on:click={() => purgePublic(true)}
                disabled={inProgress}>Delete Public Logs</button
              >
              <button
                class="btn btn-error col-span-4"
                on:click={purge}
                disabled={inProgress}
              >
                Purge Logbook
              </button>
            </LogbookSettingGroup>
          {/if}
        </div>
      </Card>
    </div>
  {/if}
</div>
<Modal id="delModal" title="Are you sure you want to delete this flight?">
  <div class="px-5 text-lg">
    <ul class="list-disc">
      <li class="list-item">
        Flight ID: <span class="font-bold">{currentFlight.id}</span>
      </li>
      <li class="list-item">
        Route: <span class="font-bold"
          >{currentFlight.dep.icao} to {currentFlight.des.icao}</span
        >
      </li>
      <li class="list-item">
        Duration: <span class="font-bold">{currentFlight.time}</span>
      </li>
    </ul>
    <div class="flex justify-end mt-3">
      <form method="dialog">
        <button
          class="btn btn-error"
          on:click={() => deleteFlight(currentFlight.id)}>Delete</button
        >
      </form>
    </div>
  </div>
</Modal>

<ToastSetup {toast}></ToastSetup>
