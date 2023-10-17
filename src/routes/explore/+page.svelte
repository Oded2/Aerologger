<script>
  import ExploreCard from "../../components/ExploreCard.svelte";
  import hrefs from "../../data/hrefs.json";
  export let data;
  const { userProfile, session } = data;
  let profileSearch = userProfile ? userProfile.username : "";
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
      {#if session}
        <div class="col-md-6">
          <ExploreCard
            title={hrefs.explore.buildprofile.title}
            desc={hrefs.explore.buildprofile.description}
            icon="wrench"
            href={hrefs.explore.buildprofile.link}
          />
        </div>{/if}
      <div class="col-md-6">
        <ExploreCard
          title={hrefs.explore.profile.title}
          desc={hrefs.explore.profile.description}
          icon="magnifying-glass"
          href={hrefs.explore.profile.link.replace("slug", profileSearch)}
          submitText="Search"
          disabled={profileSearch.length == 0}
        >
          <label for="search" class="form-label fs-5">Pilot's Username</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              id="search"
              bind:value={profileSearch}
            />
          </div>
        </ExploreCard>
      </div>
    </div>
  </div>
</main>
