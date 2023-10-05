<script>
  import { onMount } from "svelte";
  import { formatDate, getUserDetails } from "../../hooks.client.js";
  import hrefs from "../../data/hrefs.json";
  export let data;
  const api = data.sbApi;
  const user = getUserDetails(api);
  const allLogs = data.logs;
  let userLogs = [
    {
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
    },
  ];
  onMount(async () => {
    const userId = (await user).id;
    for (let i of allLogs) {
      if (i["owner"] === userId) {
        userLogs.push(i);
      }
    }
  });
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
        <div class="row bg-sky">
          {#each userLogs as log}
            <div class="col-md-6 mb-3">
              <div class="card">
                <div class="card-header font-reset">
                  <span>Flight from {formatDate(new Date(log.depDate))}</span>
                </div>
                <div class="card-body px-0 pt-0">
                  <div class="d-flex justify-content-between">
                    <h1>
                      {log.dep}
                    </h1>

                    <h1>{log.des}</h1>
                  </div>
                </div>
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
  .bg-sky {
    background-image: url("../../data/images/sky.svg");
  }
</style>
