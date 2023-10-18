<script>
  import { goto } from "$app/navigation";
  import ExploreCard from "../../components/ExploreCard.svelte";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  import hrefs from "../../data/hrefs.json";
  import { createToast } from "../../hooks.client.js";
  export let data;
  const { userProfile, supabase, session } = data;
  let toast;
  let profileSearch = userProfile ? userProfile.username : "";
  let inProgress = false;
  async function findPilot() {
    if (profileSearch.length == 0) {
      toast = createToast("error", "Error", "Search cannot be empty.");
      return;
    }
    inProgress = true;
    const { data } = await supabase
      .from("Profiles")
      .select()
      .eq("username", profileSearch);
    if (data.length > 0) {
      goto(hrefs.explore.profile.link.replace("slug", profileSearch));
      return;
    }
    inProgress = false;
    toast = createToast(
      "error",
      "User not found",
      `User "${profileSearch}" does not exist.`
    );
  }
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
        title="Settings"
        desc="Build your AeroLogger profile, make changes, and more."
        icon="wrench"
        href={hrefs.account.home.link}
        visible={session}
      />

      <ExploreCard
        title={hrefs.explore.profile.title}
        desc={hrefs.explore.profile.description}
        icon="magnifying-glass"
        submitText="Search"
        link={false}
        disabled={profileSearch.length == 0 || inProgress}
        on:click={findPilot}
      >
        <label for="search" class="form-label fs-5">Pilot's Username</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            id="search"
            placeholder="Enter a pilot's username"
            bind:value={profileSearch}
          />
          <button
            class="input-group-text btn btn-secondary"
            on:click={() => (profileSearch = "")}
            disabled={profileSearch.length == 0}
            ><i class="fa-solid fa-x" /></button
          >
        </div>
      </ExploreCard>
    </div>
  </div>
</main>

<ToastSetup {toast} />
