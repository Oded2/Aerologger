<script>
  import { createEventDispatcher } from "svelte";

  export let imgTop = false;
  export let imgBottom = false;
  export let imgUrl = "";
  export let title = "";
  export let actions = true;
  export let resetButton = false;
  export let buttonText = "";
  export let href = "";
  export let list = [];
  export let background = "bg-base-100";
  export let defaultWidth = true;
  export let wider = false;
  export let fullWidth = false;
  export let marginAuto = false;
  export let disabled = false;
  export let largeShadow = false;
  export let rounded = false;
  export let iframeUrl = "";

  const dispatch = createEventDispatcher();
</script>

<div
  class="card h-full {background}"
  class:max-w-4xl={wider}
  class:w-96={defaultWidth && !wider && !fullWidth}
  class:mx-auto={marginAuto}
  class:shadow-lg={!largeShadow}
  class:shadow-xl={largeShadow}
  class:rounded-xl={rounded}
  class:w-full={fullWidth}
>
  {#if imgTop}
    <figure>
      <img src={imgUrl} alt={title} />
    </figure>
  {/if}
  <form on:submit|preventDefault class="card-body">
    {#if title.length > 0}
      <h2 class="card-title border-b pb-2 text-2xl">{title}</h2>
    {/if}
    <div>
      {#if list.length > 0}
        <ul class="list-disc text-xl">
          {#each list as item}
            <li class="list-item">{item}</li>
          {/each}
        </ul>
      {/if}
      <slot />
    </div>
    {#if actions}
      <div class="card-actions justify-end">
        {#if resetButton}
          <button
            type="button"
            on:click={() => dispatch("reset")}
            {disabled}
            class="btn btn-secondary">Clear</button
          >
        {/if}
        {#if href.length > 0}
          <a {href} class="btn btn-primary">{buttonText}</a>
        {:else}
          <button class="btn btn-primary" type="submit" {disabled}
            >{buttonText}</button
          >
        {/if}
      </div>
    {/if}
  </form>
  {#if imgBottom || iframeUrl.length > 0}
    <figure>
      {#if imgBottom}
        <img src={imgUrl} alt={title} />
      {/if}
      {#if iframeUrl.length > 0}
        <iframe class="w-full min-h-[500px]" src={iframeUrl} {title}></iframe>
      {/if}
    </figure>
  {/if}
</div>
