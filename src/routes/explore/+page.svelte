<script>
  import { goto } from "$app/navigation";
  import Container from "$lib/components/Container.svelte";
  import ExploreCard from "$lib/components/ExploreCard.svelte";
  import FormInput from "$lib/components/FormInput.svelte";
  import ToastSetup from "$lib/components/ToastSetup.svelte";
  import { hrefs, oldHrefs } from "$lib/index.js";
  import { addParamsString } from "../../hooks.client.js";
  let toast;
  let profileSearch = "";
  let logSearch = "";
  let inProgress = false;

  function gotoProgress(link = "") {
    inProgress = true;
    goto(link);
  }
</script>

<main>
  <Container>
    <div class="my-5">
      <h1 class="text-4xl">
        Welcome to AeroLogger <span class="text-primary">Explore</span>!
      </h1>
      <p class="text-lg">
        AeroLogger Explore allows pilots to explore outside of their personal
        logbook, and take inspirations from other pilots around the world.
      </p>
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <ExploreCard
        title={oldHrefs.explore.profile.title}
        desc="Explore any AeroLogger pilot's logbook. Only flights set public by the pilot are shown."
        submitText="Search"
        disabled={inProgress}
        on:submit={() =>
          gotoProgress(hrefs.profile.link.replace("slug", profileSearch))}
      >
        <div class="mb-3">
          <label for="pilotSearch" class="label">Enter a pilot's username</label
          >
          <FormInput
            id="pilotSearch"
            required
            max="50"
            bind:value={profileSearch}
          ></FormInput>
        </div>
      </ExploreCard>
      <ExploreCard
        title="Log Search"
        desc="View any log by typing it's Log Id."
        submitText="Search"
        disabled={inProgress}
        on:submit={() =>
          gotoProgress(
            addParamsString(hrefs.viewer.link, {
              logid: logSearch,
              ref: hrefs.explore.link,
            })
          )}
      >
        <div class="mb-3">
          <label for="logId" class="label">Log ID</label>
          <FormInput id="logId" required max="50" bind:value={logSearch}
          ></FormInput>
        </div>
      </ExploreCard>
    </div>
  </Container>
</main>

<ToastSetup {toast} />
