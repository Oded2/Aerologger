<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { hrefs } from "$lib/index.js";
  import { page } from "$app/stores";
  import { themeChange } from "theme-change";
  import "../global.css";
  import Title from "$lib/components/Title.svelte";
  import logo from "$lib/images/logo_simplified_lowres.png";
  import NavItemsLi from "$lib/components/NavItemsLi.svelte";
  import Dropdown from "$lib/components/Dropdown.svelte";
  import Container from "$lib/components/Container.svelte";
  import { addParamsString } from "../hooks.client.js";

  export let data;

  $: pageUrl = new URL($page.url);
  $: activeUrl = pageUrl.pathname;
  let title = "";
  $: if (activeUrl) {
    title = findTitle();
  }

  $: supabase = data.supabase;
  $: session = data.session;

  onMount(() => {
    themeChange(false);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });
    return () => subscription.unsubscribe();
  });
  function findTitle() {
    for (const key in hrefs) {
      const item = hrefs[key];
      if (item.link === activeUrl) return item.title ?? "";
    }
    return "";
  }
</script>

<Container margin={false}>
  <div class="navbar mb-10">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost sm:hidden">
          <i class="fa-solid fa-bars"></i>
        </div>
        {#if session}
          <ul
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-base-100 rounded-box w-52"
          >
            <NavItemsLi {activeUrl}></NavItemsLi>
          </ul>
        {/if}
      </div>
      <a class="btn btn-ghost avatar" href={hrefs.home.link}
        ><img src={logo} alt="Logo" /></a
      >
    </div>
    <div class="navbar-center hidden sm:flex">
      <ul class="menu menu-horizontal px-1">
        {#if session}
          <NavItemsLi {activeUrl}></NavItemsLi>
        {/if}
      </ul>
    </div>
    <div class="navbar-end">
      <Dropdown className="btn btn-ghost me-3" icon="sun">
        <li>
          <button data-set-theme="alLight">Light</button>
        </li>
        <li>
          <button data-set-theme="alDark">Dark</button>
        </li>
      </Dropdown>
      {#if session}
        <Dropdown title="My Space" className="btn btn-primary">
          <li>
            <a
              href={addParamsString(hrefs.redProfile.link, {
                user_id: session.user.id,
              })}>Profile</a
            >
          </li>
          <li>
            <a href={hrefs.account.link}>Account</a>
          </li>
          <li>
            <a data-sveltekit-preload-data="off" href={hrefs.signout.link}
              >Sign Out</a
            >
          </li>
        </Dropdown>
      {:else}
        <a
          href={hrefs.login.link}
          class="btn btn-secondary me-3"
          class:btn-disabled={activeUrl === hrefs.login.link}>Log In</a
        >
        <a
          href={hrefs.signup.link}
          class="btn btn-primary"
          class:btn-disabled={activeUrl === hrefs.signup.link}>Sign Up</a
        >
      {/if}
    </div>
  </div>
</Container>
<slot />

{#if title.length > 0}
  <Title {title} />
{/if}
