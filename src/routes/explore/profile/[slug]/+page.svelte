<script>
  import MidScreen from "./../../../../components/MidScreen.svelte";
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
    <h1>
      <span class="text-aerologger">{`${profile.display_name}'s`}</span> Profile
    </h1>
  </div>
  <Logbook {logs} userId={session.user.id} allowModification={false} />
  <div class="container">
    <MidScreen>
      <div class="card fs-5 my-4 shadow">
        <div class="card-body">
          <h4>User Details</h4>
          <div>
            <ul>
              <li>Username: <span class="fw-bold">{profile.username}</span></li>
              <li>
                Display Name: <span class="fw-bold">{profile.display_name}</span
                >
              </li>
              {#if profile.birthday}
                <li>Age: <span class="fw-bold">{userAge}</span></li>
              {/if}
            </ul>
          </div>
        </div>
      </div>
    </MidScreen>
  </div>
</main>

<svelte:head><title>{`${profile.display_name}'s`} Profile</title></svelte:head>
