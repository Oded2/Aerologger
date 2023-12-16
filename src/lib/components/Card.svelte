<script>
  export let imgTop = false;
  export let imgUrl = "";
  export let title = "";
  export let actions = true;
  export let buttonText = "";
  export let href = "";
  export let list = [];
  export let className = "card w-96 bg-base-200 shadow-lg";
</script>

<div class={className}>
  {#if imgTop}
    <figure>
      <img src={imgUrl} alt="Shoes" />
    </figure>
  {/if}
  <div class="card-body">
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
          <button class="btn btn-primary" on:click>{buttonText}</button>
        {/if}
      </div>
    {/if}
  </div>
</div>
