<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import hrefs from "../../data/hrefs.json";
  export let data;
  const { supabase } = data;
  onMount(async () => {
    await supabase.auth.signOut();
    goto(hrefs.home.home.link);
  });
</script>
