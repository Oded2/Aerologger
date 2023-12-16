<script>
  import { hrefs } from "$lib/index.js";

  export let activeUrl = "";

  const links = [hrefs.newflight, hrefs.logbook, hrefs.explore];
</script>

{#each links as link}
  <li>
    <a
      class="sm:hover:text-accent"
      class:text-accent={activeUrl === link.link}
      href={link.link}>{link.title}</a
    >
  </li>
{/each}
