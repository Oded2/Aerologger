<script>
  import hrefs from "../../../data/hrefs.json";
  import { createToast } from "../../../hooks.client.js";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  import FloatElement from "../../../components/FloatElement.svelte";
  export let data;
  const sb = data.supabase;
  const userData = data.session.user.user_metadata;
  const user = {
    email: data.session.user.email,
    fname: userData.first_name,
    lname: userData.last_name,
  };
  let toast;

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
    toast = createToast(
      "info",
      "Check Email",
      `An email has been sent to ${newEmail} with a verification link.`,
      10000
    );
    newEmail = "";
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
    sb.auth.refreshSession();
    toggleFnameEdit();
    toast = createToast(
      "success",
      "Success",
      `Your first name has been changed to ${newFname}.`
    );
    newFname = "";
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
    toast = createToast(
      "success",
      "Success",
      `Your last name has been changed to ${newLname}.`
    );
    newLname = "";
  }
  function cancelEdits() {
    emailEdit = false;
    fnameEdit = false;
    lnameEdit = false;
  }
</script>

<main>
  <div class="container my-5">
    <div class="font-google-gabarito">
      <h1>
        Welcome back, <span class="text-aerologger">{user.fname}</span>.
      </h1>
      <h3>
        Looking for your logbook? <a
          href={hrefs.logbook.home.link}
          class="text-reset">Click Here</a
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
</main>
<FloatElement {visible}>
  <button
    class="btn btn-secondary btn-lg font-google-gabarito"
    on:click={cancelEdits}>Cancel Editing</button
  >
</FloatElement>
<ToastSetup {toast} />
