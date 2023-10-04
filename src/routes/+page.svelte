<script>
  import { onMount } from "svelte";
  import { getUserDetails } from "../hooks.client.js";
  export let data;
  const sbApi = data.sbApi;
  let fname;
  onMount(async () => {
    const user = await getUserDetails(sbApi);
    fname = user.fname;
  });
</script>

<h1>Landing Page</h1>
<h2>{fname}</h2>
