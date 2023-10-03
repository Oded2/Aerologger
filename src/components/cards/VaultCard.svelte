<script>
  export let title, description, href;
  export let iconType = "solid",
    iconName;
</script>

<div class="col-md-6 mb-5 d-flex align-items-stretch">
  <div class="card w-100">
    <div class="card-header text-center">
      <h2>
        <i class="fa-{iconType} fa-{iconName}" />
        {title}
      </h2>
    </div>
    <div class="card-body">
      <p class="fw-500 fs-4">{description}</p>
    </div>
    <div class="card-footer">
      <a {href} class="btn btn-primary fs-4 fw-bold w-100">Show Me</a>
    </div>
  </div>
</div>
