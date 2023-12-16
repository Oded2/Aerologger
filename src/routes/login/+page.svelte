<script>
  import FormInput from "$lib/components/FormInput.svelte";
  import { hrefs, oldHrefs } from "$lib/index.js";
  import ToastSetup from "$lib/components/ToastSetup.svelte";
  import { goto } from "$app/navigation";
  import Modal from "$lib/components/Modal.svelte";
  import { createToast } from "../../hooks.client.js";
  import MidScreen from "$lib/components/MidScreen.svelte";
  import Container from "$lib/components/Container.svelte";
  import Card from "$lib/components/Card.svelte";
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
    goto(oldHrefs.home.home.link);
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
  async function resetPass() {
    if (resetEmail.length == 0) {
      toast = createToast("error", "Error", "Email cannot be empty");
      return;
    }
    inProgress = true;
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: oldHrefs.passwordreset.home.weblink,
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

<Modal id="forgotpass" title="Password Reset">
  <form on:submit|preventDefault={resetPass}>
    <label for="resetEmail" class="label">Enter your email</label>
    <FormInput
      type="email"
      id="resetEmail"
      bind:value={resetEmail}
      required
      text="Email might can take up to a few moments to send."
    />
    <form method="dialog" class="card-actions justify-end">
      <button class="btn btn-primary">Send Email</button>
    </form>
  </form>
</Modal>
<main>
  <Container>
    <Card on:submit={submit} marginAuto title="Login" buttonText="Login">
      <div class="mb-3">
        Don't have an account? <a href={hrefs.signup.link} class="link"
          >sign up</a
        >.
      </div>
      <div class="mb-3">
        <label for="email" class="label">Email</label>
        <FormInput id="email" bind:value={email} required type="email" />
      </div>
      <div class="mb-3">
        <label for="password" class="label">Password</label>
        <FormInput
          id="password"
          bind:value={password}
          required
          type="password"
          max="50"
        />
      </div>
    </Card>
    <!-- <div class="card">
        <div class="card-header">
          <span
            >Don't have an account? <a
              href={oldHrefs.signup.home.link}
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
              class="btn btn-error btn-outline mt-3"
              type="reset"
              onclick="forgotpass.showModal()">Forgot Password?</button
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
      </div> -->
  </Container>
</main>
<ToastSetup {toast} />
