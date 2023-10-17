<script>
  import ExploreCard from "../../components/ExploreCard.svelte";
  import hrefs from "../../data/hrefs.json";

  export let data;
  const { logs } = data;
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
      <div class="col-md-6">
        <ExploreCard
          title={hrefs.explore.myprofile.title}
          desc={hrefs.explore.myprofile.description}
          icon="user"
          href={hrefs.explore.myprofile.link}
        />
      </div>
    </div>
  </div>
</main>
