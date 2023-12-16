<script>
  import Container from "$lib/components/Container.svelte";
  import Logbook from "$lib/components/Logbook.svelte";
  import { calculateMinutes } from "../../../hooks.client.js";
  export let data;
  const { profile, logs, session } = data;
  const userAge = calculateAge(new Date(profile.birthday));
  function calculateAge(date = new Date()) {
    const minutes = calculateMinutes(date, new Date());
    return Math.floor(minutes / 60 / 24 / 365.25);
  }
</script>

<main>
  <Container>
    <div class="mb-3">
      <h1 class="text-4xl">
        <span class="text-primary">{`${profile.display_name}'s`}</span> Profile
      </h1>
      {#if profile.bio.length > 0}
        <h5 class="text-xl">{profile.bio}</h5>
      {/if}
      {#if profile.birthday}
        <h5 class="text-xl">{userAge.toLocaleString()} Years Old</h5>
      {/if}
      <h6 class="text-lg">Pilot's username: {profile.username}</h6>
    </div>

    <Logbook
      {logs}
      userId={session ? session.user.id : ""}
      allowModification={false}
    />
  </Container>
</main>

<svelte:head><title>{`${profile.display_name}'s`} Profile</title></svelte:head>
