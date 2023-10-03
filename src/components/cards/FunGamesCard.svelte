<script>
  export let gameLink;
  export let icon;
  export let iconType = "solid";
  export let title = "";
  export let description = "";
</script>

<div class="col-lg-6 col-xxl-4 mb-5">
  <div class="card bg-secondary-subtle h-100">
    <div class="card-body">
      <div class="border-bottom border-black">
        <h1>
          <i class="fa-{iconType} fa-{icon}" />&nbsp; <em>{title}</em>
        </h1>
      </div>
      <div class="mt-1">
        <p class="font-google-quicksand fs-5 fw-600">
          {description}
        </p>
      </div>
    </div>
    <div class="card-footer">
      <a href={gameLink} class="btn btn-dark w-100 fs-4 h-100"
        ><i class="fa-solid fa-trophy" />&nbsp; Play</a
      >
    </div>
  </div>
</div>
