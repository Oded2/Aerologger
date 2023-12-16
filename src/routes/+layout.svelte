<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { hrefs, oldHrefs } from "$lib/index.js";
  import { page } from "$app/stores";
  import "../global.css";
  import Title from "$lib/components/Title.svelte";
  import logo from "$lib/images/logo_simplified_lowres.png";
  import NavItemsLi from "$lib/components/NavItemsLi.svelte";
  import Dropdown from "$lib/components/Dropdown.svelte";

  $: pageUrl = new URL($page.url);
  $: pageHref = pageUrl.pathname;
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
      if (item.link === pageHref) return item.title;
    }
  }
</script>

<div class="navbar">
  <div class="navbar-start">
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost sm:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16"
          /></svg
        >
      </div>
      <ul
        class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-base-100 rounded-box w-52"
      >
        <NavItemsLi></NavItemsLi>
      </ul>
    </div>
    <a class="btn btn-ghost avatar" href={hrefs.home.link}
      ><img src={logo} alt="Logo" /></a
    >
  </div>
  <div class="navbar-center hidden sm:flex">
    <ul class="menu menu-horizontal px-1">
      <NavItemsLi></NavItemsLi>
    </ul>
  </div>
  <div class="navbar-end">
    {#if session}
      <Dropdown title="My Space" className=" btn btn-primary">
        <li><a href={hrefs.redProfile.link}>Profile</a></li>
        <li>
          <a href={hrefs.account.link}>Account</a>
        </li>
        <li><a href={hrefs.signout.link}>Sign Out</a></li>
      </Dropdown>
    {:else}
      <a href={hrefs.signup.link} class="btn btn-primary">Sign Up</a>
    {/if}
  </div>
</div>

<slot />

{#if title}
  <Title {title} />
{/if}
