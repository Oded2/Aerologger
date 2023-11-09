<script>
  export let id = "";
  export let header = "";
  export let scroll = true;
</script>

<div
  class="offcanvas offcanvas-start"
  data-bs-scroll={scroll}
  tabindex="-1"
  {id}
  aria-labelledby={`${id}Label`}
>
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id={`${id}Label`}>{header}</h5>
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    />
  </div>
  <div class="offcanvas-body">
    <slot />
  </div>
</div>
