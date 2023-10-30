<script>
  export let title = "";
  export let desc = "";
  export let icon = "",
    iconType = "solid";
  export let submitText = "Explore";
  export let visible = true;
  export let comingSoon = false;
  export let disabled = false;
  disabled = disabled || comingSoon;
</script>

{#if visible}
  <div class="col-md-6 mb-5">
    <form on:submit|preventDefault class="h-100">
      <div class="card h-100 shadow">
        <div class="card-header text-center">
          <h4><i class={`fa-${iconType} fa-${icon}`} /> {title}</h4>
        </div>
        <div class="card-body">
          {#if comingSoon}
            <h5 class="fw-bold"><em>Coming Soon</em></h5>
          {/if}

          <slot />
          <p class="fs-5">{desc}</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-lg w-100" {disabled} type="submit"
            >{submitText}</button
          >
        </div>
      </div>
    </form>
  </div>
{/if}
