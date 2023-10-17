<script>
  export let breakpoint = "lg";
</script>

<div class="row">
  <div class={`col-${breakpoint}`} />
  <div class={`col-${breakpoint}-auto`}>
    <slot />
  </div>
  <div class={`col-${breakpoint}`} />
</div>
