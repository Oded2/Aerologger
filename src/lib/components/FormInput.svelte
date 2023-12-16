<script>
  import { createEventDispatcher } from "svelte";

  export let id = "";
  export let value = "";
  export let placeholder = "";
  export let text = "";
  export let type = "text";
  export let min = "";
  export let max = "";
  export let rows = "10";
  export let cols = "30";
  export let required = false;

  const dispatch = createEventDispatcher();
</script>

{#if type === "date"}
  <label class="form-control w-full max-w-xs">
    <input
      {required}
      bind:value
      {min}
      {max}
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
{:else if type === "email"}
  <label class="form-control w-full max-w-xs">
    <input
      {required}
      bind:value
      minlength={min}
      maxlength={max}
      {id}
      type="email"
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
{:else if type === "password"}
  <label class="form-control w-full max-w-xs">
    <input
      {required}
      bind:value
      minlength={min}
      maxlength={max}
      {id}
      type="password"
      {placeholder}
      class="input input-bordered w-full"
      on:blur={() => {
        dispatch("blur");
      }}
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
      {required}
      bind:value
      {min}
      {max}
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
{:else if type === "textarea"}
  <label class="form-control">
    <textarea
      {required}
      {rows}
      {cols}
      bind:value
      class="textarea textarea-bordered resize-none"
      {placeholder}
      {id}
      on:blur={() => {
        value = value.trim();
        dispatch("blur");
      }}
    ></textarea>
    {#if text.length > 0}
      <div class="label">
        <span class="label-text-alt">{text}</span>
      </div>
    {/if}
  </label>
{:else}
  <label class="form-control w-full max-w-xs">
    <input
      {required}
      bind:value
      minlength={min}
      maxlength={max}
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
