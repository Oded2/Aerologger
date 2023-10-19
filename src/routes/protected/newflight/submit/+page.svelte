<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import hrefs from "../../../../data/hrefs.json";
  import logo from "../../../../data/images/logo_simplified.png";
  export let data;
  const { supabase, session } = data;
  const urlParams = $page.url.searchParams;

  const params = {
    dep: data.dep,
    des: data.des,
    depDate: urlParams.get("depDate"),
    desDate: urlParams.get("desDate"),
    plane: data.plane,
    identification: urlParams.get("planeId"),
    type: urlParams.get("planeType"),
    notes: urlParams.get("userNotes"),
    public: urlParams.get("isPublic") === "true",
    user_id: session.user.id,
  };

  let isComplete = false,
    isError = false;
  let logNumber = NaN;
  onMount(async () => {
    const { data: copy } = await supabase
      .from("Logs")
      .select()
      .eq("user_id", session.user.id)
      .eq("depDate", params.depDate)
      .eq("desDate", params.desDate);
    if (copy.length > 0) {
      logNumber = copy[0].id;
      isComplete = true;
      return;
    }
    const { data, error } = await supabase.from("Logs").insert(params).select();
    if (error) {
      isError = true;
      console.error(error.message);
      return;
    }
    logNumber = data[0].id;
    isComplete = true;
  });
</script>

<main>
  <div class="container">
    {#if isComplete}
      <h1 class="text-success">Success</h1>
      <h2>
        Your flight has been added to your <a href={hrefs.logbook.home.link}
          >logbook</a
        >.
      </h2>

      <div class="row my-4">
        <div class="col">
          <a
            href={hrefs.logbook.viewer.link.replace("slug", logNumber)}
            class="btn btn-primary btn-lg fs-2 w-100 h-100">View Flight</a
          >
        </div>
        <div class="col">
          <a
            href={hrefs.newFlight.home.link}
            class="btn btn-outline-primary btn-lg fs-2 w-100 h-100"
            >Log New Flight</a
          >
        </div>

        <div class="d-flex justify-content-center">
          <img src={logo} alt="AeroLogger's Logo" class="img-fluid" />
        </div>
      </div>
    {:else if isError}
      <h1 class="text-danger">An error has occured. Please try again.</h1>
    {:else}
      <h1><i class="fa-solid fa-spinner fa-spin" /></h1>
    {/if}
  </div>
</main>

<style>
  img {
    max-height: 60vh;
  }
</style>
