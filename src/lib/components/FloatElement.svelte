<script>
  export let visible = true;
</script>

{#if visible}
  <div class="m-3 print:hidden z-50 fixed bottom-0 right-0">
    <slot />
  </div>
{/if}
