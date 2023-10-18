<script>
  export let title = "";
  export let desc = "";
  export let icon = "",
    iconType = "solid";
  export let href = "";
  export let submitText = "Show Me";
  export let disabled = false;
  export let link = true;
  export let visible = true;
</script>

{#if visible}
  <div class="col-md-6">
    <form on:submit|preventDefault class="h-100">
      <div class="card h-100 shadow">
        <div class="card-header text-center">
          <h4><i class={`fa-${iconType} fa-${icon}`} /> {title}</h4>
        </div>
        <div class="card-body">
          <p class="fs-5">{desc}</p>
          <slot />
        </div>
        <div class="card-footer">
          {#if link}
            <a {href} class="btn btn-primary btn-lg w-100" class:disabled
              >{submitText}</a
            >
          {:else}
            <button
              class="btn btn-primary btn-lg w-100"
              {disabled}
              type="submit">{submitText}</button
            >
          {/if}
        </div>
      </div>
    </form>
  </div>
{/if}
