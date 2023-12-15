<script>
  import { goto } from "$app/navigation";
  import MidScreen from "$lib/components/MidScreen.svelte";
  import ToastSetup from "$lib/components/ToastSetup.svelte";
  import { oldHrefs } from "$lib/index.js";
  import { createToast } from "../../../hooks.client.js";
  export let data;
  const { supabase, session } = data;
  let toast;
  let password = "",
    confirmPass = "";
  $: isValid =
    password === confirmPass && password.length >= 8 && confirmPass.length >= 8;
  let inProgress = false;
  function showErrorToast(desc) {
    toast = createToast("error", "Error", desc);
  }
  function verify() {
    if (password !== confirmPass) {
      showErrorToast("Passwords must match.");
      return false;
    }
    if (password.length < 8) {
      showErrorToast("Password must be at least 8 characters long.");
      return false;
    }
    return true;
  }
  async function submit() {
    if (!verify()) {
      return;
    }
    inProgress = true;
    const { error } = await supabase.auth.updateUser({ password: password });
    if (error) {
      inProgress = false;
      showErrorToast(error.message);
      return;
    }
    toast = createToast(
      "success",
      "Password Reset",
      "You will be automatically redirected in 5 seconds."
    );
    setTimeout(() => {
      goto(oldHrefs.home.home.link);
    }, 5000);
  }
</script>

<main>
  <div class="container py-5 font-google-quicksand fs-4">
    {#if session}
      <MidScreen maxWidth={true}>
        <form on:submit|preventDefault={submit}>
          <div class="card">
            <div class="card-header fs-6">
              <span>Account: {session.user.email}</span>
            </div>
            <div class="card-body fs-3">
              <div class="mb-3">
                <label class="fw-bold" for="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  minlength="8"
                  required
                  bind:value={password}
                />
                <div class="form-text">Minimum 8 characters.</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold" for="confirmpass"
                  >Confirm New Password {#if password == confirmPass}
                    <i
                      class="fa-solid fa-circle-check"
                      style="color: #198754;"
                    />
                  {:else}
                    <i
                      class="fa-solid fa-circle-xmark"
                      style="color: #dc3545;"
                    />
                  {/if}</label
                >
                <input
                  type="password"
                  id="confirmpass"
                  class="form-control"
                  minlength="8"
                  required
                  bind:value={confirmPass}
                />
              </div>
            </div>
            <div class="card-footer">
              <button
                class="btn btn-primary fs-4 fw-bold w-100"
                type="submit"
                disabled={!isValid || inProgress}>Reset Password</button
              >
            </div>
          </div>
        </form></MidScreen
      >
    {:else}
      <h1>You are not signed in.</h1>
    {/if}
  </div>
</main>

<ToastSetup {toast} />
