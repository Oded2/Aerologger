<script>
  export let title;
  export let description;
  export let iconType = "solid";
  export let icon;
  export let href;
  export let large = false;
</script>

<div class="col-md-6 mt-5" class:col-xl-4={!large}>
  <div class="card shadow-lg h-100 border-0">
    <div class="card-body">
      <div class="row display-flex align-items-center">
        <div class="col-1 pb-1">
          <i class="fa-{iconType} fa-{icon} fs-3" />
        </div>
        <div class="col-10">
          <h3 class="font-google-quicksand fw-600 text-center">
            {title}
          </h3>
        </div>
      </div>

      <div class="container-fluid px-1">
        <p class="fs-5">
          {description}
        </p>
      </div>
    </div>

    <div class="card-footer">
      <a {href} class="btn btn-primary w-100 fs-5"
        ><i class="fa-solid fa-clone" />&nbsp; Show Me</a
      >
    </div>
  </div>
</div>
