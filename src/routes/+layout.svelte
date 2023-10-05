<script>
  import "../global.css";
  import hrefs from "../data/hrefs.json";
  import { page } from "$app/stores";
  import { getUserDetails } from "../hooks.client.js";
  import { onMount } from "svelte";
  export let data;
  const sbApi = data.sbApi;
  let userId;
  let title = "AeroLogger";
  $: pageUrl = $page.url;
  $: pageHref = pageUrl.href.replace(pageUrl.origin, "");
  $: if (pageHref) {
    title = findTitle();
    userId = getUserDetails(sbApi);
  }
  function findTitle() {
    for (let key in hrefs) {
      const current = hrefs[key];
      for (let secondKey in current) {
        const secondCurrent = current[secondKey];
        if (secondCurrent["link"] == pageHref) {
          return secondCurrent["title"];
        }
      }
    }
  }
</script>

<nav class="navbar navbar-expand-md font-google-quicksand">
  <div class="container">
    <a href="/" class="navbar-brand fw-600">AeroLogger</a>
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
            href={hrefs.home.home.link}
            class="nav-link"
            class:active={pageHref == hrefs.home.home.link}>Home</a
          >
        </li>
        <li class="nav-item">
          <a
            href={hrefs.logbook.home.link}
            class="nav-link"
            class:active={pageHref == hrefs.logbook.home.link}>Logbook</a
          >
        </li>
        <li class="nav-item">
          <a
            href={hrefs.newFlight.home.link}
            class="nav-link"
            class:active={pageHref == hrefs.newFlight.home.link}>New Flight</a
          >
        </li>
        <li class="nav-item">
          <a
            href={hrefs.contact.home.link}
            class="nav-link"
            class:active={pageHref == hrefs.contact.home.link}>Contact</a
          >
        </li>
      </ul>
      {#await userId then userId}
        <ul class="navbar-nav ms-auto">
          {#if userId}
            <li class="nav-item mb-1 mb-md-0 me-md-2">
              <a
                href={hrefs.account.home.link}
                class="btn btn-outline-primary fw-600"
                class:disabled={pageHref == hrefs.account.home.link}>Account</a
              >
            </li>
            <li class="nav-item mb-1 mb-md-0">
              <a
                href={hrefs.signout.home.link}
                class="btn btn-outline-danger fw-600"
                class:disabled={pageHref == hrefs.signout.home.link}>Signout</a
              >
            </li>
          {:else}
            <li class="nav-item mb-1 mb-md-0 me-md-2">
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
          {/if}
        </ul>
      {/await}
    </div>
  </div>
</nav>
<slot />

<svelte:head>
  <title>{title}</title>
</svelte:head>
