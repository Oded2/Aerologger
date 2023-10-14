<script>
  import { fly } from "svelte/transition";
  import { fade } from "svelte/transition";
  export let showModal = false;
</script>

{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="backdrop d-flex align-items-center justify-content-center"
    transition:fade={{ duration: 100 }}
    on:click|self
  >
    <div
      class=" container bg-light rounded card"
      in:fly={{ duration: 300, y: 200 }}
    >
      <div class="card-body overflow-auto d-grid">
        <slot />
      </div>
      <div class="card-footer text-center">
        <span class="fw-light">Click anywhere outside the modal to close.</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 2;
  }
  .card {
    min-height: 50%;
    max-height: 85%;
  }
</style>
