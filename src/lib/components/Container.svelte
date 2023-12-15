<script>
  export let margin = true;
  export let padding = true;
</script>

<div
  class="container mx-auto"
  class:px-2={padding}
  class:sm:px-0={padding}
  class:my-10={margin}
>
  <slot />
</div>
