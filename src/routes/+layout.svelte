<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import hrefs from "../data/hrefs.json";
  import { page } from "$app/stores";
  import "../global.css";
  import Title from "../components/Title.svelte";
  import logo from "../data/images/logo_simplified_lowres.png";

  $: pageUrl = new URL($page.url);
  $: pageHref = pageUrl.pathname;
  let title = "AeroLogger";
  let darkMode = false;
  $: if (pageHref) {
    title = findTitle();
  }
  export let data;
  $: supabase = data.supabase;
  $: session = data.session;

  onMount(() => {
    if (getTheme() === "dark") document.getElementById("darkSwitch").click();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });
    return () => subscription.unsubscribe();
  });

  function toggleDarkMode() {
    darkMode = !darkMode;
    document.cookie = `theme=${darkMode ? "dark" : "light"};max-age=31536000`;
  }
  function getTheme() {
    const first = document.cookie
      .split(";")
      .find((row) => row.includes("theme"));
    return first ? first.split("=")[1] : "light";
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

<nav class="navbar navbar-expand-lg font-google-quicksand">
  <div class="container">
    <a href={hrefs.home.home.link} class="navbar-brand fw-600 py-0"
      ><img src={logo} alt="AeroLogger Logo" class="img-fluid" /></a
    >
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
            class:active={pageHref == hrefs.home.home.link}
          >
            <i class="fa-solid fa-house" /> Home</a
          >
        </li>
        <li class="nav-item">
          <a
            href={hrefs.logbook.home.link}
            class="nav-link"
            class:disabled={!session}
            class:active={pageHref == hrefs.logbook.home.link}
          >
            <i class="fa-solid fa-book" /> Logbook</a
          >
        </li>
        <li class="nav-item">
          <a
            href={hrefs.newFlight.home.link}
            class="nav-link"
            class:disabled={!session}
            class:active={pageHref == hrefs.newFlight.home.link}
          >
            <i class="fa-solid fa-plane" /> New Log</a
          >
        </li>
        <li class="nav-item">
          <a
            href={hrefs.explore.home.link}
            class="nav-link"
            class:active={pageHref == hrefs.explore.home.link}
          >
            <i class="fa-solid fa-earth-americas" /> Explore</a
          >
        </li>
        <li class="nav-item">
          <a
            href={hrefs.contact.home.link}
            class="nav-link"
            class:active={pageHref == hrefs.contact.home.link}
            ><i class="fa-solid fa-address-card" /> Contact</a
          >
        </li>
      </ul>
      <ul class="navbar-nav ms-auto">
        <li class="nav-item mb-1 mb-lg-0 me-lg-2">
          <button
            class="btn btn-dark"
            class:active={darkMode}
            aria-pressed={darkMode}
            id="darkSwitch"
            on:click={toggleDarkMode}
            >{#if darkMode}
              <i class="fa-solid fa-sun" style="color: #f3bc24;" />
            {:else}
              <i class="fa-solid fa-moon" style="color: #fafafa;" />
            {/if}
          </button>
        </li>
        {#if session}
          <li class="nav-item mb-1 mb-lg-0 me-lg-2">
            <a
              href={hrefs.account.home.link}
              class="btn btn-primary fw-600"
              class:disabled={pageHref == hrefs.account.home.link}>Account</a
            >
          </li>
          <li class="nav-item mb-1 mb-lg-0">
            <a
              href={hrefs.signout.home.link}
              class="btn fw-600"
              class:btn-dark={!darkMode}
              class:btn-light={darkMode}
              class:disabled={pageHref == hrefs.signout.home.link}>Signout</a
            >
          </li>
        {:else}
          <li class="nav-item mb-1 mb-lg-0 me-lg-2">
            <a
              href={hrefs.login.home.link}
              class="btn btn-primary fw-600"
              class:disabled={pageHref == hrefs.login.home.link}>Log In</a
            >
          </li>
          <li class="nav-item">
            <a
              href={hrefs.signup.home.link}
              class="btn fw-600"
              class:btn-dark={!darkMode}
              class:btn-light={darkMode}
              class:disabled={pageHref == hrefs.signup.home.link}>Sign Up</a
            >
          </li>
        {/if}
      </ul>
    </div>
  </div>
</nav>
<slot />

{#if title}
  <Title {title} />
{/if}

<style>
  img {
    height: 3rem;
  }
</style>
