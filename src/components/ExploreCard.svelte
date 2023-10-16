<script>
  export let title = "";
  export let desc = "";
  export let icon = "",
    iconType = "solid";
  export let href = "";
</script>

<div class="card h-100 shadow">
  <div class="card-header text-center">
    <h4><i class={`fa-${iconType} fa-${icon}`} /> {title}</h4>
  </div>
  <div class="card-body">
    <p class="fs-5">{desc}</p>
  </div>
  <div class="card-footer">
    <a {href} class="btn btn-primary btn-lg w-100">Show Me</a>
  </div>
</div>
