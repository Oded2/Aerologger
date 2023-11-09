<script>
  export let visible = true;
</script>

{#if visible}
  <div class="m-3 d-print-none">
    <slot />
  </div>
{/if}

<style>
  div {
    z-index: 1;
    position: fixed;
    bottom: 0;
    right: 0;
  }
</style>
