<script>
  import { createSbClient, createToast } from "../../hooks.client.js";
  import hrefs from "../../data/hrefs.json";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  export let data;
  const api = data.sbApi;
  const sb = createSbClient(api);
  let toast;
  let inProgress = false;
  let email = "",
    fname = "",
    lname = "",
    password = "",
    confirmpass = "";

  $: passMatch = password === confirmpass;
  $: passLen = password.length >= 8;
  $: emailLen = email.length > 0;
  function submit() {
    if (!validateForm()) {
      return;
    }
    console.log("Submitted");
  }
  function validateForm() {
    const errorToast = (description) => {
      toast = createToast("error", "Invalid Credentials", description);
    };
    if (!emailLen) {
      errorToast("Email cannot be empty");
      return false;
    }
    if (!passLen) {
      errorToast("Password must be at least 8 characters long.");
      return false;
    }

    if (!passMatch) {
      errorToast("Passwords must be matching.");
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
            >Already have an account? <a
              href={hrefs.login.home.link}
              class="text-reset">Login</a
            ></span
          >
        </div>
        <div class="card-body fs-3 row">
          <div class="col-md-12 mb-3">
            <label for="email" class="form-label"
              >Email <span title="Required field" class="required">*</span
              ></label
            >
            <input
              type="email"
              id="email"
              class="form-control"
              bind:value={email}
            />
            <div class="invalid-feedback">Hello</div>
            <div class="form-text fs-6">
              You will have to verify this email afterwards.
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label for="fname" class="form-label">First Name</label>

            <input
              type="text"
              id="fname"
              class="form-control"
              bind:value={fname}
            />
          </div>
          <div class="col-md-6 mb-3">
            <label for="lname" class="form-label">Last Name</label>
            <input
              type="text"
              id="lname"
              class="form-control"
              bind:value={lname}
            />
          </div>
          <div class="col-md-6">
            <label for="password" class="form-label"
              >Password <span title="Required field" class="required">*</span
              ></label
            >
            <input
              type="password"
              id="password"
              class="form-control"
              bind:value={password}
            />
          </div>
          <div class="col-md-6">
            <label for="confirmpass" class="form-label"
              >Confirm Password {#if passMatch}
                <i
                  class="fa-solid fa-circle-check"
                  style="color: #198754;"
                  title="Your passwords match"
                />
              {:else}
                <i
                  class="fa-solid fa-circle-xmark"
                  style="color: #dc3545;"
                  title="Your passwords do not match"
                />
              {/if}</label
            >
            <input
              type="password"
              id="confirmpass"
              class="form-control"
              bind:value={confirmpass}
            />
          </div>
        </div>
        <div class="card-footer px-sm-5">
          <button
            class="btn btn-primary btn-lg fs-4 fw-bold w-100"
            disabled={inProgress}
            type="submit">Sign Up</button
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
