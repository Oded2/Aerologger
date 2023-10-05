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
  import FloatElement from "../../components/FloatElement.svelte";
  export let data;
  const api = data.sbApi;
  let user = getUserDetails(api);
  const sb = createSbClient(api);
  let toast;
  onMount(async () => {
    (await user) ? false : goto(hrefs.login.home.link);
  });

  let newEmail = "",
    newFname = "",
    newLname = "";
  let emailEdit = false,
    fnameEdit = false,
    lnameEdit = false;
  let inProgress = false;
  $: visible = emailEdit || fnameEdit || lnameEdit;
  function toggleEmailEdit() {
    emailEdit = !emailEdit;
  }
  function toggleFnameEdit() {
    fnameEdit = !fnameEdit;
  }
  function toggleLnameEdit() {
    lnameEdit = !lnameEdit;
  }
  async function changeEmail() {
    if (newEmail.length == 0) {
      toast = createToast("error", "Error", "New email cannot be empty");
      return;
    }
    inProgress = true;
    const { error } = await sb.auth.updateUser({ email: newEmail });
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    toggleEmailEdit();
    newEmail = "";
    refrshUser();
    toast = createToast(
      "info",
      "Check Email",
      `An email has been sent to ${newEmail} with a verification link.`,
      10000
    );
  }
  async function changeFname() {
    inProgress = true;
    const { error } = await sb.auth.updateUser({
      data: { first_name: newFname },
    });
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    toggleFnameEdit();
    newFname = "";
    refrshUser();
    toast = createToast(
      "success",
      "Success",
      `Your first name has been changed to ${newFname}.`
    );
  }
  async function changeLname() {
    inProgress = true;
    const { error } = await sb.auth.updateUser({
      data: { last_name: newLname },
    });
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    toggleLnameEdit();
    newLname = "";
    refrshUser();
    toast = createToast(
      "success",
      "Success",
      `Your last name has been changed to ${newLname}.`
    );
  }
  function refrshUser() {
    user = getUserDetails(api);
  }
  function cancelEdits() {
    emailEdit = false;
    fnameEdit = false;
    lnameEdit = false;
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
                  class="form-control fs-5"
                  bind:value={newEmail}
                />
              {:else}
                {user.email}
              {/if}
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
            <div class="col-lg-3 mb-3 fw-bold">First Name</div>
            <div class="col-lg-6 fw-500 mb-3">
              {#if fnameEdit}
                <input
                  type="text"
                  placeholder="Type your new first name here"
                  class="form-control fs-5"
                  bind:value={newFname}
                />
              {:else}
                {user.fname ? user.fname : "No first name set."}
              {/if}
            </div>

            <div class="col-lg-3 mb-3">
              {#if fnameEdit}
                <button
                  class="btn btn-primary font-google-quicksand fw-bold fs-4 w-100"
                  disabled={inProgress}
                  on:click={changeFname}>Confirm</button
                >
              {:else}
                <button
                  class="btn btn-primary font-google-quicksand fw-bold fs-4 w-100"
                  on:click={toggleFnameEdit}
                  ><i class="fa-solid fa-pen-to-square" />
                  Edit</button
                >
              {/if}
            </div>
            <div class="col-lg-3 mb-3 fw-bold">Last Name</div>
            <div class="col-lg-6 fw-500 mb-3">
              {#if lnameEdit}
                <input
                  type="text"
                  placeholder="Type your new last name here"
                  class="form-control fs-5"
                  bind:value={newLname}
                />
              {:else}
                {user.lname ? user.lname : "No last name set."}
              {/if}
            </div>

            <div class="col-lg-3 mb-3">
              {#if lnameEdit}
                <button
                  class="btn btn-primary font-google-quicksand fw-bold fs-4 w-100"
                  disabled={inProgress}
                  on:click={changeLname}>Confirm</button
                >
              {:else}
                <button
                  class="btn btn-primary font-google-quicksand fw-bold fs-4 w-100"
                  on:click={toggleLnameEdit}
                  ><i class="fa-solid fa-pen-to-square" />
                  Edit</button
                >
              {/if}
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
<FloatElement {visible}>
  <button
    class="btn btn-secondary btn-lg font-google-gabarito"
    on:click={cancelEdits}>Cancel Editing</button
  >
</FloatElement>
<ToastSetup {toast} />
