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
  };
  let toast;
  let newEmail = "";
  let emailEdit = false;
  let inProgress = false;
  $: visible = emailEdit;
  function toggleEmailEdit() {
    emailEdit = !emailEdit;
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

  function cancelEdits() {
    emailEdit = false;
  }
</script>

<main>
  <div class="container my-5">
    <div class="font-google-gabarito">
      <h1>Welcome back.</h1>
      <h3>
        Looking to edit your profile? <a
          href={hrefs.explore.buildprofile.link}
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

          <div class="col-lg-3">
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
