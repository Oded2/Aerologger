<script>
  import Card from "./Card.svelte";

  export let title = "";
  export let desc = "";
  export let submitText = "Explore";
  export let visible = true;
  export let disabled = false;
</script>

{#if visible}
  <Card {title} buttonText={submitText} {disabled} marginAuto on:submit>
    <div class="text-lg">
      <slot />
    </div>
    <p class="fs-5 mb-2">{desc}</p>
  </Card>
{/if}
