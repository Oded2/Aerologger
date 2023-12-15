<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { oldHrefs } from "$lib/index.js";
  export let data;
  const { supabase } = data;
  onMount(async () => {
    await supabase.auth.signOut();
    goto(oldHrefs.home.home.link);
  });
</script>
