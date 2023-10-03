<script>
  export let showFullScreen = true;
  export let dark = false;
</script>

{#if showFullScreen}
  <main class="fullscreen {dark ? 'text-bg-dark' : 'text-bg-light'}">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="p-1 d-print-none">
      <button class="w-100 fs-4 btn btn-outline-danger exit" on:click>
        Exit
      </button>
    </div>
    <slot />
  </main>
{/if}

<style>
  main.fullscreen {
    z-index: 1;
    min-height: 100vh;
    width: 100vw;
    max-width: 100%;
    position: absolute;
    top: 0;
  }
  button.exit {
    border-radius: 0;
  }
</style>
