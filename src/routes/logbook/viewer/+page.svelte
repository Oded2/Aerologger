<script>
  import { page } from "$app/stores";
  import {
    createSbClient,
    getUserDetails,
    formatDate,
    getTimeStr,
  } from "../../../hooks.client.js";
  import hrefs from "../../../data/hrefs.json";
  import FloatElement from "../../../components/FloatElement.svelte";
  export let data;
  const api = data.sbApi;
  const sbUrl = data.sbUrl;
  const allLogs = data.logs;
  const sb = createSbClient(api);
  const url = $page.url;
  const user = getUserDetails(api);
  const logId = url.searchParams.get("logId");
  let valid = !isNaN(logId);
  let log = {
    id: 6,
    owner: "7e65410d-ff08-4e75-bd4d-e1de80402744",
    dep: "LLHZ",
    des: "LLBG",
    depDate: "2023-10-05T08:46:00",
    desDate: "2023-10-05T20:35:00",
    type: "airplane",
    model: "Airbus A350",
    identification: "4X-CHA",
    notes: "Fun Flight",
    public: false,
  };
  for (const i of allLogs) {
    if (i["id"] == logId) {
      log = i;
    }
  }
  function formatDateTime(string = "") {
    let date = new Date(string);
    return `${formatDate(date)} at ${getTimeStr(date)}`;
  }
</script>

<main>
  <div class="container py-5">
    {#if valid}
      {#await user}
        <h1>Loading...</h1>
      {:then user}
        {#if log.public ? true : user ? user.id === log.owner : false}
          <div class="font-google-gabarito">
            <div class="text-center">
              <h1>{log.dep} to {log.des}</h1>
            </div>
            <div class="row fs-3">
              <div class="col-md mb-5">
                <div class="card shadow h-100">
                  <div class="card-header text-center">
                    <h3>
                      <i class="fa-solid fa-plane-circle-exclamation" /> Plane Information
                    </h3>
                  </div>
                  <div class="card-body">
                    <div class=" text-center border-bottom py-2">
                      Aircraft Type: <span class="text-capitalize text-primary"
                        >{log.type}</span
                      >
                    </div>
                    <div class=" text-center border-bottom py-2">
                      Aircraft Model : <span
                        class="text-capitalize text-primary"
                      >
                        {log.model}</span
                      >
                    </div>
                    <div class="text-center border-bottom py-2">
                      Aircraft ID: <span class="text-uppercase text-primary">
                        {log.identification}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md mb-5">
                <div class="card shadow h-100">
                  <div class="card-header text-center">
                    <h3>
                      <i class="fa-solid fa-plane" /> Flight Information
                    </h3>
                  </div>
                  <div class="card-body">
                    <div class=" text-center border-bottom py-2">
                      Airport of Departure: <span
                        class="text-capitalize text-primary">{log.dep}</span
                      >
                    </div>
                    <div class=" text-center border-bottom py-2">
                      Time of Departure : <span class="text-primary">
                        {formatDateTime(log.depDate)}</span
                      >
                    </div>
                    <div class="text-center border-bottom py-2">
                      Airport of Destination: <span class="text-primary">
                        {log.des}</span
                      >
                    </div>
                    <div class="text-center border-bottom py-2">
                      Time of Arrival: <span class="text-primary">
                        {formatDateTime(log.desDate)}</span
                      >
                    </div>
                    <!-- TODO: ADD TOTAL FLIGHT TIME IN HOURS AND MINUTES. -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        {:else}
          <h1>
            Access denied, try <a
              href={hrefs.login.home.link}
              class="text-reset">logging in</a
            >.
          </h1>
        {/if}
      {/await}
    {:else}
      <h1>Invalid Parameters</h1>
    {/if}
  </div>
</main>

<FloatElement
  ><a href={hrefs.logbook.home.link} class="btn btn-secondary btn-lg"
    ><i class="fa-solid fa-rotate-left" /> Return to Logbook</a
  ></FloatElement
>
