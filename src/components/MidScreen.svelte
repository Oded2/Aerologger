<script>
  export let breakpoint = "lg";
  export let wide = true;
  export let maxWidth = false;
</script>

<div class="row">
  <div class={`col-${breakpoint}`} />
  <div class={`col-${breakpoint}-auto `}>
    <div class:wide class:max-width={maxWidth}>
      <slot />
    </div>
  </div>
  <div class={`col-${breakpoint}`} />
</div>

<style>
  @media (min-width: 600px) {
    div.wide {
      min-width: 600px;
    }
  }
  div.max-width {
    max-width: 800px;
  }
</style>
