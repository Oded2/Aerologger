<script>
  import { hrefs } from "$lib/index.js";

  const links = [hrefs.newflight, hrefs.logbook, hrefs.explore];
</script>

{#each links as link}
  <li>
    <a class="sm:hover:text-primary" href={link.link}>{link.title}</a>
  </li>
{/each}
