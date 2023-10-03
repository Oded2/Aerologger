<script>
</script>

<div class="parent m-3 d-print-none">
  <slot />
</div>

<style>
  div.parent {
    z-index: 1;
    position: fixed;
    bottom: 0;
    right: 0;
  }
</style>
