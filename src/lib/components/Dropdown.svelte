<script>
  export let title = "";
  export let className = "";
  export let icon = "";
  export let iconType = "solid";
</script>

<div class="dropdown dropdown-end">
  <div tabindex="0" role="button" class={className}>
    {#if title.length > 0}
      {title}
    {:else if icon.length > 0}
      <i class="fa-{iconType} fa-{icon}"></i>
    {:else}
      <i class="fa-solid fa-angle-down"></i>
    {/if}
  </div>
  <ul
    class="dropdown-content z-[1] menu p-2 shadow-2xl bg-base-100 rounded-box w-52"
  >
    <slot />
  </ul>
</div>
