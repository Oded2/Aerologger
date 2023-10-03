<script>
  export let show = true;
  export let title = "";
  export let description = "";
  export let iconType = "solid";
  export let icon = "circle-question";
  export let mainLink = null;
  export let sourceLink = null;
  export let type = "link";
  const fullIcon = `fa-${iconType} fa-${icon}`;
</script>

{#if show}
  <div class="col-xl-4 col-md-6 d-flex mb-5">
    <div class="card text-bg-dark shadow-lg">
      <div class="card-body text-center d-md-flex flex-md-column px-0 px-md-3">
        <div class="h1 mb-5">
          <i class={fullIcon} />
        </div>
        <h3 class="font-google-roboto-mono">{title}</h3>
        <div class="container-fluid">
          <p class="text-start fs-5 font-google-quicksand">
            {description}
          </p>
        </div>
        <div class="container-fluid mt-auto">
          {#if sourceLink}
            <a
              href={sourceLink}
              class="btn btn-outline-secondary text-white fs-5 w-100 mb-2"
              ><i class="fa-brands fa-github" />&nbsp; Source Code</a
            >
          {/if}
          <div class="mb-2">
            <slot />
          </div>
          <a href={mainLink} class="btn btn-primary fs-5 w-100">
            {#if type == "download"}<i class="fa-solid fa-download" />&nbsp;
              Download
            {:else if type == "link"}
              <i class="fa-regular fa-folder-open" />&nbsp; Show me
            {/if}
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}
