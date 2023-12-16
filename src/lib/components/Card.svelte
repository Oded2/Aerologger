<script>
  export let imgTop = false;
  export let imgBottom = false;
  export let imgUrl = "";
  export let title = "";
  export let actions = true;
  export let buttonText = "";
  export let href = "";
  export let list = [];
  export let background = "bg-base-100";
  export let className = `card w-96 ${background} shadow-lg h-full`;
  export let marginAuto = false;
  export let disabled = false;
</script>

<div class={className} class:mx-auto={marginAuto}>
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
            <li>{item}</li>
          {/each}
        </ul>
      {/if}
      <slot />
    </div>
    {#if actions}
      <div class="card-actions justify-end">
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
  {#if imgBottom}
    <figure>
      <img src={imgUrl} alt={title} />
    </figure>
  {/if}
</div>
