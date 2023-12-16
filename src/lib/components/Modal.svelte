<script>
  export let id = "";
  export let title = "";
  export let backdrop = true;
</script>

<dialog {id} class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >✕</button
      >
    </form>
    {#if title.length > 0}
      <h3 class="font-bold text-xl mb-3">{title}</h3>
    {/if}
    <slot />
  </div>
  {#if backdrop}
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  {/if}
</dialog>
