<script>
  import Logbook from "../../../../components/Logbook.svelte";
  import { calculateMinutes } from "../../../../hooks.client.js";
  export let data;
  const { profile, logs, session } = data;
  const userAge = calculateAge(new Date(profile.birthday));
  function calculateAge(date = new Date()) {
    const minutes = calculateMinutes(date, new Date());
    return Math.floor(minutes / 60 / 24 / 365.25);
  }
</script>

<main>
  <div class="container mt-5 font-google-gabarito">
    <div class="mb-3">
      <h1>
        <span class="text-aerologger">{`${profile.display_name}'s`}</span> Profile
      </h1>
      {#if profile.bio.length > 0}
        <h5>{profile.bio}</h5>
      {/if}
      <h5>{userAge.toLocaleString()} Years Old</h5>
      <h6>Pilot's username: {profile.username}</h6>
    </div>
  </div>
  <Logbook {logs} userId={session.user.id} allowModification={false} />
</main>

<svelte:head><title>{`${profile.display_name}'s`} Profile</title></svelte:head>
