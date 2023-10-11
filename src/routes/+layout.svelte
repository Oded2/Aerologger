<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import hrefs from "../data/hrefs.json";
  import { page } from "$app/stores";
  import "../global.css";
  $: pageUrl = new URL($page.url);
  $: pageHref = pageUrl.href.replace(pageUrl.origin, "");
  let title = "AeroLogger";
  $: if (pageHref) {
    title = findTitle();
  }
  export let data;
  $: supabase = data.supabase;
  $: session = data.session;
  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => subscription.unsubscribe();
  });
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

<!-- <script>
  import "../global.css";
  import hrefs from "../data/hrefs.json";
  import { page } from "$app/stores";
  import { delelteAllParams } from "../hooks.client.js";
  export let data;
  const userId = data.session;
  let title = "AeroLogger";
  $: pageUrl = new URL($page.url);
  $: delelteAllParams(pageUrl);
  $: pageHref = pageUrl.href.replace(pageUrl.origin, "");
  $: if (pageHref) {
    title = findTitle();
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
</script> -->
<nav class="navbar navbar-expand-md font-google-quicksand">
  <div class="container">
    <a href={hrefs.home.home.link} class="navbar-brand fw-600">AeroLogger</a>
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
      <ul class="navbar-nav ms-auto">
        {#if session}
          <li class="nav-item mb-1 mb-md-0 me-md-2">
            <a
              href={hrefs.account.home.link}
              class="btn btn-primary fw-600"
              class:disabled={pageHref == hrefs.account.home.link}>Account</a
            >
          </li>
          <li class="nav-item mb-1 mb-md-0">
            <a
              href={hrefs.signout.home.link}
              class="btn btn-dark fw-600"
              class:disabled={pageHref == hrefs.signout.home.link}>Signout</a
            >
          </li>
        {:else}
          <li class="nav-item mb-1 mb-md-0 me-md-2">
            <a
              href={hrefs.login.home.link}
              class="btn btn-primary fw-600"
              class:disabled={pageHref == hrefs.login.home.link}>Log In</a
            >
          </li>
          <li class="nav-item">
            <a
              href={hrefs.signup.home.link}
              class="btn btn-dark fw-600"
              class:disabled={pageHref == hrefs.signup.home.link}>Sign Up</a
            >
          </li>
        {/if}
      </ul>
    </div>
  </div>
</nav>
<slot />
<svelte:head><title>{title}</title></svelte:head>
