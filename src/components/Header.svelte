<script>
  import { onMount } from "svelte";
  import { createSbClient } from "../hooks.client.js";
  import hrefs from "../data/hrefs.json";
  import { goto } from "$app/navigation";
  export let title = null,
    showTitle = true;
  export let directory = null;
  export let isHome = false;
  export let sbApi;
  export let isProtected = false,
    noAccount = false;
  const isPersonal = directory
    ? directory.home.title == hrefs.vault.home.title
    : false;
  const suffix = isPersonal ? "Personal Vault" : "Code Vault";
  const newTitle = !title || !showTitle ? suffix : title + ` - ${suffix}`;
  let userData;
  onMount(async () => {
    if (sbApi) {
      const sb = createSbClient(sbApi);
      const { data } = await sb.auth.getSession();
      if (data.session) {
        if (noAccount) {
          goto(hrefs.home);
          return;
        }
        userData = data.session.user;
        return;
      }

      if (isProtected) {
        goto(hrefs.login.link);
        return;
      }
    }
  });

  let breakpoint;
  let pages = [];
  for (let i in directory) {
    pages.push(i);
  }
  if (pages.length < 3) {
    breakpoint = "sm";
  } else if (pages.length < 4) {
    breakpoint = "lg";
  } else {
    breakpoint = "xl";
  }
</script>

<svelte:head>
  <title>{newTitle}</title>
</svelte:head>

<nav class="navbar bg-dark navbar-dark navbar-expand-{breakpoint}">
  <div class="container">
    <a href={hrefs["home"]} class="navbar-brand"
      >{#if isHome}Oded's Website
      {:else}Code <span class="text-warning">Vault</span>{/if}</a
    >
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navmenu"
    >
      <span class="navbar-toggler-icon" />
    </button>

    <div class="collapse navbar-collapse" id="navmenu">
      {#if directory}
        <ul class="navbar-nav ms-{breakpoint}-5">
          {#each pages as page}
            <li>
              <a
                href={directory[page]["link"]}
                class="nav-link"
                class:active={directory[page]["title"] == title}
                >{directory[page]["title"]}</a
              >
            </li>
          {/each}
        </ul>
      {/if}
      <ul class="navbar-nav ms-auto">
        {#if sbApi}
          {#if !userData}
            <a
              href={hrefs.signup.link}
              class="nav-link"
              class:active={title == hrefs.signup.title}>{hrefs.signup.title}</a
            >
            <a
              href={hrefs.login.link}
              class="nav-link"
              class:active={title == hrefs.login.title}>{hrefs.login.title}</a
            >
          {:else}
            <a
              href={hrefs.signout.link}
              class="nav-link"
              class:active={title == hrefs.signout.title}
              >{hrefs.signout.title}</a
            >
            <a
              href={hrefs.account.link}
              class="nav-link"
              class:active={title == hrefs.account.title}
              >{hrefs.account.title}</a
            >
          {/if}
        {/if}
        <li>
          <a
            href={hrefs["about"]["link"]}
            class="nav-link"
            class:active={title == hrefs["about"]["title"]}>About</a
          >
        </li>
        <li>
          <a
            href={hrefs["contact"]["link"]}
            class="nav-link"
            class:active={title == hrefs["contact"]["title"]}>Contact</a
          >
        </li>
      </ul>
    </div>
  </div>
</nav>
