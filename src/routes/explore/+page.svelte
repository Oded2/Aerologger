<script>
  import { goto } from "$app/navigation";
  import ExploreCard from "../../components/ExploreCard.svelte";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  import hrefs from "../../data/hrefs.json";
  import { addParamsString } from "../../hooks.client.js";
  export let data;
  const { userProfile } = data;
  let toast;
  let profileSearch = userProfile ? userProfile.username : "";
  let logSearch = "";
</script>

<main>
  <div class="container mt-5 font-google-gabarito">
    <div class="my-5">
      <h1>
        Welcome to <span class="text-aerologger">AeroLogger Explore</span>!
      </h1>
      <p class="font-google-quicksand fs-4">
        AeroLogger Explore allows pilots to explore outside of their personal
        logbook, and take inspirations from other pilots around the world.
      </p>
    </div>
    <div class="row">
      <ExploreCard
        title={hrefs.explore.profile.title}
        desc={hrefs.explore.profile.description}
        icon="magnifying-glass"
        submitText="Search"
        on:submit={() =>
          goto(hrefs.explore.profile.link.replace("slug", profileSearch))}
      >
        <div class="mb-3 input-group">
          <div class="form-floating">
            <input
              type="text"
              class="form-control"
              id="search"
              placeholder="Enter a pilot's username"
              bind:value={profileSearch}
              required
            /> <label for="search">Pilot's Username</label>
          </div>
          <button
            class="input-group-text btn btn-secondary"
            type="button"
            on:click={() => (profileSearch = "")}
            disabled={profileSearch.length == 0}
            ><i class="fa-solid fa-x" /></button
          >
        </div>
      </ExploreCard>
      <ExploreCard
        title="Log Search"
        desc="View any log by typing it's Log Id."
        icon="plane"
        submitText="Search"
        on:submit={() =>
          goto(
            addParamsString(hrefs.logbook.viewer.link, {
              logId: logSearch,
              ref: hrefs.explore.home.link,
            })
          )}
      >
        <div class="mb-3 input-group">
          <div class="form-floating">
            <input
              type="text"
              class="form-control input-num-clean"
              id="logsearch"
              placeholder="Enter a pilot's username"
              bind:value={logSearch}
              required
            /> <label for="logsearch">Log Id</label>
          </div>
          <button
            class="input-group-text btn btn-secondary"
            type="button"
            on:click={() => (logSearch = "")}
            disabled={logSearch.length == 0}><i class="fa-solid fa-x" /></button
          >
        </div>
      </ExploreCard>
    </div>
  </div>
</main>

<ToastSetup {toast} />
