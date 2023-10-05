<script>
  import hrefs from "../../data/hrefs.json";
  import {
    createSbClient,
    createToast,
    getUserDetails,
  } from "../../hooks.client.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  export let data;
  const api = data.sbApi;
  const user = getUserDetails(api);
  const sb = createSbClient(api);
  let toast;
  onMount(async () => {
    (await user) ? false : goto(hrefs.login.home.link);
  });

  let newEmail = "",
    newFname,
    newLname;
  let emailEdit = false,
    nameEdit = false;
  let inProgress = false;
  function toggleEmailEdit() {
    emailEdit = !emailEdit;
  }
  async function changeEmail() {
    if (newEmail.length == 0) {
      toggleEmailEdit();
      toast = createToast("error", "Error", "New email cannot be empty");
      return;
    }
    inProgress = true;
    const { error } = await sb.auth.updateUser({ email: newEmail });
    inProgress = false;
    toggleEmailEdit();
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    toast = createToast(
      "info",
      "Check Email",
      `An email has been sent to ${newEmail} with a verification link.`
    );
  }
</script>

<main>
  {#await user}
    <h1>Loading...</h1>
  {:then user}
    <div class="container my-5">
      <div class="font-google-gabarito">
        <h1>Welcome back, <span class="text-primary">{user.fname}</span>.</h1>
        <h3>
          Looking for your logbook? <a href="/" class="text-reset">Click Here</a
          >.
        </h3>
      </div>
      <div class="card shadow my-5">
        <div class="card-header">
          <span class="font-google-quicksand">Account Settings</span>
        </div>
        <div class="card-body fs-2 font-google-quicksand">
          <div class="row text-center">
            <div class="col-lg-3 mb-3 fw-bold">Email</div>
            <div class="col-lg-6 mb-3 fw-500">
              {#if emailEdit}
                <input
                  type="email"
                  placeholder="Type your new email here"
                  class="form-control h-100 fs-5"
                  bind:value={newEmail}
                />
              {:else}{user.email}{/if}
            </div>

            <div class="col-lg-3 mb-3">
              {#if emailEdit}
                <button
                  class="btn btn-primary font-google-quicksand fw-bold fs-4 w-100"
                  disabled={inProgress}
                  on:click={changeEmail}>Confirm</button
                >
              {:else}
                <button
                  class="btn btn-primary font-google-quicksand fw-bold fs-4 w-100"
                  on:click={toggleEmailEdit}
                  ><i class="fa-solid fa-pen-to-square" />
                  Edit</button
                >
              {/if}
            </div>
            <div class="col-lg-3 mb-3 fw-bold">Name</div>
            <div class="col-lg-6 fw-500">{user.fname} {user.lname}</div>

            <div class="col-lg-3 mb-3">
              <button
                class="btn btn-primary font-google-quicksand fw-bold fs-4 w-100"
                ><i class="fa-solid fa-pen-to-square" /> Edit</button
              >
            </div>
          </div>
          <div class="pt-3 text-center border-top">
            <a
              href={hrefs.passwordreset.home.link}
              class="btn btn-outline-danger font-google-quicksand fw-bold fs-4 w-100"
              >Reset Password</a
            >
          </div>
        </div>
      </div>
    </div>
  {/await}
</main>
<!-- <main>
  <div class="container my-5">
    {#await user}
      <h1>Loading data...</h1>
    {:then userDetails}
      <h1 class="font-google-gabarito">
        Welcome back, <span class="text-primary">{userDetails.fname}</span>
      </h1>
      <div class="card shadow">
        <div class="card-header fs-6"><span>AeroLogger</span></div>
        <div class="card-body">
          <div class="row mb-2 border-bottom pb-2">
            <div class="col-md">
              <h3>Email</h3>
            </div>
            <div class="col-md">
              <button
                class="btn btn-outline-primary btn-lg w-100 font-google-gabarito"
                >Edit</button
              >
            </div>
            <div class="col-md text-center">
              <h3>{userDetails.email}</h3>
            </div>
          </div>
          <div class="row mb-2 pb-2 border-bottom">
            <div class="col-md">
              <h3>First Name</h3>
            </div>
            <div class="col-md">
              <button
                class="btn btn-outline-primary btn-lg w-100 font-google-gabarito"
                >Edit</button
              >
            </div>
            <div class="col-md text-center">
              <h3>{userDetails.fname}</h3>
            </div>
          </div>
          <div class="row mb-2 pb-2 border-bottom">
            <div class="col-md">
              <h3>Last Name</h3>
            </div>
            <div class="col-md">
              <button
                class="btn btn-outline-primary btn-lg w-100 font-google-gabarito"
                >Edit</button
              >
            </div>
            <div class="col-md text-center">
              <h3>{userDetails.lname}</h3>
            </div>
          </div>
          <div>
            <a
              href="/"
              class="btn btn-outline-danger btn-lg w-100 font-google-gabarito"
              >Reset Password</a
            >
          </div>
        </div>
      </div>
    {/await}
  </div>
</main> -->
<ToastSetup {toast} />
