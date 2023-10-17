<script>
  export let title = "";
  export let desc = "";
  export let icon = "",
    iconType = "solid";
  export let href = "";
  export let submitText = "Show Me";
  export let disabled = false;
</script>

<div class="card h-100 shadow">
  <div class="card-header text-center">
    <h4><i class={`fa-${iconType} fa-${icon}`} /> {title}</h4>
  </div>
  <div class="card-body">
    <p class="fs-5">{desc}</p>
    <slot />
  </div>
  <div class="card-footer">
    <a {href} class="btn btn-primary btn-lg w-100" class:disabled
      >{submitText}</a
    >
  </div>
</div>
