<script>
  import { hrefs } from "$lib/index.js";
  import FormInput from "$lib/components/FormInput.svelte";
  import ToastSetup from "$lib/components/ToastSetup.svelte";
  import {
    dateToStr,
    createToast,
    hasNormalCharacters,
  } from "../../hooks.client.js";
  import Card from "$lib/components/Card.svelte";
  import Container from "$lib/components/Container.svelte";
  export let data;
  const { supabase } = data;
  let toast;
  let email = "",
    username = "",
    displayName = "",
    dob = "",
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
  <Container>
    {#if !isComplete}
      <Card
        allowWide
        on:submit={submit}
        marginAuto
        title="Sign Up"
        buttonText="Sign Up"
      >
        <div class="mb-3">
          Already have an account? <a href={hrefs.login.link} class="link"
            >login</a
          >.
        </div>
        <div class="text-xl grid md:grid-cols-2 gap-2">
          <div>
            <div class="mb-3">
              <label for="email" class="label">Email</label>
              <FormInput
                id="email"
                bind:value={email}
                required
                type="email"
                text="You will have to verify this email afterwards."
              />
            </div>
            <div class="mb-3">
              <label for="username" class="label">Username</label>
              <FormInput
                id="username"
                bind:value={username}
                required
                text="Must be unique and up to 50 letters."
              ></FormInput>
            </div>
            <div class="mb-3">
              <label for="displayName" class="label">Display Name</label>
              <FormInput
                id="displayName"
                bind:value={displayName}
                required
                text="Can be whatever you want up to 50 letters."
              ></FormInput>
            </div>
          </div>
          <div>
            <div class="mb-3">
              <label for="birthday" class="label">Birthday</label>
              <FormInput
                id="birthday"
                bind:value={dob}
                max={dateToStr()}
                required
                type="date"
                text="Your birthday will be public. This field is not required."
              />
            </div>
            <div class="mb-3">
              <label for="password" class="label">Password</label>
              <FormInput
                type="password"
                id="password"
                bind:value={password}
                required
                min="8"
                max="50"
                text="Must be between 8 to 50 characters long."
              ></FormInput>
            </div>
            <div class="mb-3">
              <label for="confirmpass" class="label">
                <span
                  >Confirm Password
                  {#if passMatch}
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
                  {/if}</span
                >
              </label>
              <FormInput
                id="confirmpass"
                type="password"
                bind:value={confirmpass}
                min="8"
                max="50"
                required
              ></FormInput>
            </div>
          </div>
        </div>
      </Card>
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
  </Container>
</main>
<ToastSetup {toast} />
