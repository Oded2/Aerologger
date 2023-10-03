<script>
  import "../global.css";
  const googleFontsUrl = new URL("https://fonts.googleapis.com/css2");
  const fonts = ["quicksand"];
</script>

<nav class="navbar navbar-expand-lg font-google-quicksand">
  <div class="container">
    <a href="/" class="navbar-brand">AeroLogger</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <div
      class="collapse navbar-collapse justify-content-end"
      id="navbarSupportedContent"
    >
      <ul class="navbar-nav">
        <li class="nav-item me-2">
          <a href="/" class="btn btn-outline-primary fw-600">Log In</a>
        </li>
        <li class="nav-item">
          <a href="/" class="btn btn-outline-secondary fw-600">Sign Up</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
<slot />

<svelte:head />
