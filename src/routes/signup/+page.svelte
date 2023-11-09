<script>
  import hrefs from "$lib/hrefs.json";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  import {
    dateToStr,
    createToast,
    hasNormalCharacters,
  } from "../../hooks.client.js";
  import MidScreen from "../../components/MidScreen.svelte";
  export let data;
  const { supabase } = data;
  let toast;
  let email = "",
    username = "",
    displayName = "",
    dob = dateToStr(),
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
    const valid = await handleSignUp();
    if (!valid) {
      inProgress = false;
      return;
    }
    isComplete = true;
  }
  const handleSignUp = async () => {
    const { data } = await supabase
      .from("Profiles")
      .select("username")
      .eq("username", username);
    if (data.length > 0) {
      toast = createToast(
        "error",
        "Username is already taken",
        "Username is already taken by another user"
      );
      return false;
    }
    const {
      data: {
        user: { id },
      },
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    const { error } = await supabase.from("Profiles").insert({
      user_id: id,
      username,
      display_name: displayName,
      birthday: dob ? new Date(dob).toISOString() : null,
    });
    if (error) {
      toast = createToast(
        "error",
        "Error",
        error.code === "23505" ? "Username already taken" : error.message
      );
      return false;
    }
    return true;
  };
  function verifyInput(value = "", max = 50) {
    return value.length != 0 && value && value.length <= max;
  }
  function validateForm() {
    const errorToast = (description) => {
      toast = createToast("error", "Invalid Credentials", description);
    };
    if (!emailLen) {
      errorToast("Email cannot be empty");
      return false;
    }
    if (!verifyInput(username) || !hasNormalCharacters(username)) {
      errorToast("Username is invalid");
      return false;
    }
    if (!verifyInput(displayName)) {
      errorToast("Display Name is invalid");
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
      <MidScreen maxWidth={true}>
        <form on:submit|preventDefault={submit}>
          <div class="card shadow-sm">
            <div class="card-header">
              <span
                >Already have an account? <a
                  href={hrefs.login.home.link}
                  class="text-reset">Login</a
                ></span
              >
            </div>
            <div class="card-body fs-3 row">
              <div class="col-md-6 mb-3">
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

                <div class="form-text">
                  You will have to verify this email afterwards.
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="dob" class="form-label">Date of Birth</label>
                <div class="input-group">
                  <input
                    type="date"
                    id="dob"
                    class="form-control"
                    bind:value={dob}
                    max={dateToStr()}
                  />
                  <button
                    class="btn btn-secondary input-group-text"
                    type="button"
                    on:click={() => (dob = null)}
                    disabled={dob == null}><i class="fa-solid fa-x" /></button
                  >
                </div>
                <div class="form-text">
                  Your birthday will be public. This field is not required.
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="username" class="form-label"
                  >Username <span title="Required field" class="required"
                    >*</span
                  ></label
                >
                <input
                  type="text"
                  id="username"
                  class="form-control"
                  bind:value={username}
                  required
                  max="50"
                />

                <div class="form-text">
                  Your username must be unique and cannot contain any special
                  characters.
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="displayName" class="form-label"
                  >Display Name <span title="Required field" class="required"
                    >*</span
                  ></label
                >
                <input
                  type="text"
                  id="displayName"
                  class="form-control"
                  bind:value={displayName}
                  required
                  max="50"
                />

                <div class="form-text">Your display name will be public.</div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="password" class="form-label"
                  >Password <span title="Required field" class="required"
                    >*</span
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
              <div class="col-md-6 mb-3">
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
        </form></MidScreen
      >
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
