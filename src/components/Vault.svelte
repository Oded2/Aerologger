<script>
  import FloatElement from "./FloatElement.svelte";
  export let visible = false,
    inProgress = false,
    shadow = true;
  export let btnColor = "light";
</script>

{#if visible}
  <FloatElement
    ><button
      class="btn btn-{btnColor} fs-2"
      class:shadow
      on:click
      disabled={inProgress}><i class="fa-solid fa-vault" /></button
    ></FloatElement
  >
{/if}
