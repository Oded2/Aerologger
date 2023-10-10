<script>
  import hrefs from "../../data/hrefs.json";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  export let data;
  let { supabase } = data;
  $: ({ supabase } = data);
  let toast;
  let email = "",
    fname = "",
    lname = "",
    password = "",
    confirmpass = "";
  let inProgress = false,
    isComplete = false;
  $: passMatch = password === confirmpass;
  $: passMin = password.length >= 8;
  $: passMax = password.length <= 72;
  $: emailLen = email.length > 0;
  async function submit() {
    if (!validateForm()) {
      return;
    }
    inProgress = true;
    await handleSignUp();
    isComplete = true;
  }
  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: fname,
          last_name: lname,
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
  };
  function validateForm() {
    const errorToast = (description) => {
      toast = createToast("error", "Invalid Credentials", description);
    };
    if (!emailLen) {
      errorToast("Email cannot be empty");
      return false;
    }
    if (!passMin) {
      errorToast("Password must be at least 8 characters long.");
      return false;
    }
    if (!passMax) {
      errorToast("Password cannot be more than 72 characters long.");
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
    {#if !isComplete}
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
                required
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
                required
                minlength="8"
                maxlength="72"
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
                required
                minlength="8"
                maxlength="72"
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
    {:else}
      <div class="text-center">
        <h1 class=" fw-bold">Hello, Pilot.</h1>
        <h2 class=" fw-bold">
          A verification email has been sent to <span class="text-aerologger"
            >{email}</span
          >
        </h2>
        <h6>Email might take a few moments to arrive.</h6>
      </div>
    {/if}
  </div>
</main>
<ToastSetup {toast} />

<style>
  span.required {
    color: red;
  }
</style>
