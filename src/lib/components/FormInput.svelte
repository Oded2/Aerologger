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
  export let disabled = false;
  export let maxWidth = true;
  export let joinItem = false;

  const dispatch = createEventDispatcher();
</script>

{#if type === "date"}
  <label class="form-control w-full" class:max-w-xs={maxWidth}>
    <input
      {required}
      bind:value
      {min}
      {max}
      {id}
      type="date"
      {placeholder}
      class="input input-bordered w-full"
      {disabled}
    />
    {#if text.length > 0}
      <div class="label">
        <span class="label-text-alt">{text}</span>
      </div>
    {/if}
  </label>
{:else if type === "email"}
  <label class="form-control w-full" class:max-w-xs={maxWidth}>
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
      {disabled}
    />
    {#if text.length > 0}
      <div class="label">
        <span class="label-text-alt">{text}</span>
      </div>
    {/if}
  </label>
{:else if type === "password"}
  <label class="form-control w-full" class:max-w-xs={maxWidth}>
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
      {disabled}
    />
    {#if text.length > 0}
      <div class="label">
        <span class="label-text-alt">{text}</span>
      </div>
    {/if}
  </label>
{:else if type === "time"}
  <label class="form-control w-full" class:max-w-xs={maxWidth}>
    <input
      {required}
      bind:value
      {min}
      {max}
      {id}
      type="time"
      {placeholder}
      class="input input-bordered w-full"
      {disabled}
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
      {disabled}
    ></textarea>
    {#if text.length > 0}
      <div class="label">
        <span class="label-text-alt">{text}</span>
      </div>
    {/if}
  </label>
{:else if type === "checkbox"}
  <div class="form-control max-w-[15rem]">
    <label class="label cursor-pointer">
      <span class="label-text text-base font-semibold">{text}</span>
      <input
        type="checkbox"
        bind:checked={value}
        class="checkbox"
        {disabled}
        on:input
      />
    </label>
  </div>
{:else if type === "select"}
  <select
    {id}
    bind:value
    class="select select-bordered w-full"
    {disabled}
    class:max-w-xs={maxWidth}><slot /></select
  >
{:else}
  <label class="form-control w-full join" class:max-w-xs={maxWidth}>
    <input
      {required}
      bind:value
      minlength={min}
      maxlength={max}
      {id}
      type="text"
      {placeholder}
      class="input input-bordered w-full"
      class:join-item={joinItem}
      {disabled}
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
