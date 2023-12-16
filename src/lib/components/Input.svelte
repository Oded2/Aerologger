<script>
  import { createEventDispatcher } from "svelte";

  export let id = "";
  export let value = "";
  export let placeholder = "";
  export let text = "";
  export let type = "text";

  const dispatch = createEventDispatcher();
</script>

{#if type === "date"}
  <label class="form-control w-full max-w-xs">
    <input
      bind:value
      {id}
      type="date"
      {placeholder}
      class="input input-bordered w-full"
    />
    {#if text.length > 0}
      <div class="label">
        <span class="label-text-alt">{text}</span>
      </div>
    {/if}
  </label>
{:else if type === "time"}
  <label class="form-control w-full max-w-xs">
    <input
      bind:value
      {id}
      type="time"
      {placeholder}
      class="input input-bordered w-full"
    />
    {#if text.length > 0}
      <div class="label">
        <span class="label-text-alt">{text}</span>
      </div>
    {/if}
  </label>
{:else}
  <label class="form-control w-full max-w-xs">
    <input
      bind:value
      {id}
      type="text"
      {placeholder}
      class="input input-bordered w-full"
      on:blur={() => {
        value = value.trim();
        dispatch("blur");
      }}
    />
    {#if text.length > 0}
      <div class="label">
        <span class="label-text-alt">{text}</span>
      </div>
    {/if}
  </label>
{/if}
