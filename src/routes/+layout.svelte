<script>
  import "../global.css";
  import hrefs from "../data/hrefs.json";
  import { page } from "$app/stores";
  $: pageUrl = $page.url;
  $: pageHref = pageUrl.href.replace(pageUrl.origin, "");
</script>

<nav class="navbar navbar-expand-md font-google-quicksand">
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
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav m-auto">
        <li class="nav-item">
          <a
            href="/"
            class="nav-link"
            class:active={pageHref == hrefs.home.home.link}>Home</a
          >
        </li>
      </ul>
      <ul class="navbar-nav ms-auto">
        <li class="nav-item me-md-2 mb-1 mb-md-0">
          <a
            href={hrefs.login.home.link}
            class="btn btn-outline-primary fw-600"
            class:disabled={pageHref == hrefs.login.home.link}>Log In</a
          >
        </li>
        <li class="nav-item">
          <a
            href={hrefs.signup.home.link}
            class="btn btn-outline-secondary fw-600"
            class:disabled={pageHref == hrefs.signup.home.link}>Sign Up</a
          >
        </li>
      </ul>
    </div>
  </div>
</nav>
<slot />

<svelte:head />
