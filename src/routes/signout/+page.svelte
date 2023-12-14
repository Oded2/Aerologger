<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { hrefs } from "$lib/index.js";
  export let data;
  const { supabase } = data;
  onMount(async () => {
    await supabase.auth.signOut();
    goto(hrefs.home.home.link);
  });
</script>
