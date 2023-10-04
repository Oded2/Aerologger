<script>
  import { createSbClient, createToast } from "../../hooks.client.js";
  import hrefs from "../../data/hrefs.json";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  import { goto } from "$app/navigation";
  export let data;
  const api = data.sbApi;
  const sb = createSbClient(api);
  let toast;
  let email = "",
    password = "";
  let inProgress = false;
  $: emailLen = email.length > 0;
  $: passwordLen = password.length > 0;
  async function submit() {
    if (!validateForm()) {
      return;
    }
    inProgress = true;
    const { error } = await sb.auth.signInWithPassword({
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
</script>

<main>
  <div class="container my-5 font-google-quicksand">
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
    </form>
  </div>
</main>
<ToastSetup {toast} />

<style>
  span.required {
    color: red;
  }
</style>
