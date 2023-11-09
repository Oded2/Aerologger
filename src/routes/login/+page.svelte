<script>
  import hrefs from "$lib/hrefs.json";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  import { goto } from "$app/navigation";
  import Modal from "../../components/Modal.svelte";
  import { createToast } from "../../hooks.client.js";
  import MidScreen from "$lib/components/MidScreen.svelte";
  export let data;
  const { supabase } = data;
  let toast;
  let email = "",
    password = "";
  let resetEmail = "";
  let inProgress = false;
  let showModal = false;
  $: emailLen = email.length > 0;
  $: passwordLen = password.length > 0;
  async function submit() {
    if (!validateForm()) {
      return;
    }
    inProgress = true;
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      inProgress = false;
      toast = createToast("error", "Error", error.message);
      return;
    }
    goto(hrefs.home.home.link);
  }
  function validateForm() {
    const errorToast = (description) => {
      toast = createToast("error", "Invalid Credentials", description);
    };
    if (!emailLen) {
      errorToast("Email cannot be empty");
      return false;
    }
    if (!passwordLen) {
      errorToast("Password cannot be empty");
      return false;
    }

    return true;
  }
  function toggleModal() {
    showModal = !showModal;
  }
  async function resetPass() {
    if (resetEmail.length == 0) {
      toast = createToast("error", "Error", "Email cannot be empty");
      return;
    }
    inProgress = true;
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: hrefs.passwordreset.home.weblink,
    });
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    toast = createToast(
      "info",
      "Check email",
      `An email has been sent to ${resetEmail} with the instructions to reset your password. Email might take a few moments to arrive.`,
      10000
    );
  }
</script>

<Modal {showModal} on:click={toggleModal}>
  <div class="p-sm-5 fs-2">
    <label for="resetEmail" class="font-google-quicksand fw-600"
      >Enter your email</label
    >
    <input
      type="email"
      class="form-control"
      id="resetEmail"
      bind:value={resetEmail}
    />
    <button
      class="btn btn-primary font-google-quicksand fw-bold fs-4 my-2 w-100"
      disabled={inProgress}
      on:click={resetPass}>Send link</button
    >
    <div class="form-text">
      Email might can take up to a few moments to send.
    </div>
  </div>
</Modal>
<main>
  <div class="container my-5 font-google-quicksand">
    <MidScreen maxWidth={true}>
      <form on:submit|preventDefault={submit}>
        <div class="card">
          <div class="card-header">
            <span
              >Don't have an account? <a
                href={hrefs.signup.home.link}
                class="text-reset">Sign Up</a
              ></span
            >
          </div>
          <div class="card-body fs-3">
            <div class="mb-3">
              <label for="email" class="form-label"
                >Email <span title="Required field" class="required">*</span
                ></label
              >
              <input
                type="email"
                id="email"
                class="form-control"
                bind:value={email}
                required
              />
            </div>

            <div>
              <label for="password" class="form-label"
                >Password <span title="Required field" class="required">*</span
                ></label
              >
              <input
                type="password"
                id="password"
                class="form-control"
                bind:value={password}
                required
              />
              <button
                class="btn btn-outline-danger mt-3 fw-600"
                type="reset"
                on:click={toggleModal}>Forgot Password?</button
              >
            </div>
          </div>
          <div class="card-footer px-sm-5">
            <button
              class="btn btn-primary btn-lg fs-4 fw-bold w-100"
              disabled={inProgress}
              type="submit">Login</button
            >
          </div>
        </div>
      </form></MidScreen
    >
  </div>
</main>
<ToastSetup {toast} />

<style>
  span.required {
    color: red;
  }
</style>
