<script>
  export let breakpoint = "lg";
  export let wide = true;
</script>

<div class="row">
  <div class={`col-${breakpoint}`} />
  <div class={`col-${breakpoint}-auto `}>
    <div class:wide>
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
</style>
