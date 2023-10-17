<script>
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  import { createToast, dateToStr } from "../../../hooks.client.js";
  import MidScreen from "../../../components/MidScreen.svelte";
  export let data;
  const { supabase, session, profile } = data;
  let toast;
  let inProgress = false;
  let username = profile ? profile.username : "",
    displayName = profile ? profile.display_name : "",
    birthday = profile ? dateToStr(new Date(profile.birthday)) : "";

  $: disabled =
    inProgress ||
    !validString(username) ||
    username.length == 0 ||
    displayName.length == 0;
  function validString(inputString = "") {
    return inputString.length == 0 ? true : /^[a-zA-Z0-9]+$/.test(inputString);
  }
  async function submit() {
    if (!verify()) {
      return;
    }
    inProgress = true;
    const { error } = await supabase.from("Profiles").upsert({
      user_id: session.user.id,
      username: username,
      display_name: displayName,
      birthday: birthday.length > 0 ? new Date(birthday).toISOString() : null,
    });
    inProgress = false;
    if (error) {
      toast = createToast(
        "error",
        "Error",
        error.code === "23505" ? "Username already taken" : error.message
      );
      return;
    }
    toast = createToast(
      "success",
      "Success",
      "Your AeroLogger profile has been updated."
    );
  }
  function verify() {
    if (username.length == 0 || !username) {
      toast = createToast("error", "Error", "Username cannot be empty");
      return false;
    }
    if (username.length > 50) {
      toast = createToast(
        "error",
        "Error",
        "Username cannot be more than 50 characters long."
      );
      return false;
    }
    if (!validString(username)) {
      toast = createToast(
        "error",
        "Error",
        "Username cannot contain special characters."
      );
      return false;
    }
    if (displayName.length == 0 || !displayName) {
      toast = createToast("error", "Error", "Display name cannot be empty");
      return false;
    }
    if (displayName.length > 50) {
      toast = createToast(
        "error",
        "Error",
        "Display name cannot be more than 50 characters long."
      );
      return false;
    }
    if (
      birthday.length > 0 &&
      new Date(birthday).valueOf() > new Date().valueOf()
    ) {
      toast = createToast("error", "Error", "Birthday cannot be after today");
      return false;
    }
    return true;
  }
</script>

<main>
  <div class="container font-google-gabarito my-5">
    <div>
      <h1>Hello, <span class="text-aerologger">Pilot</span>!</h1>
      <h2>
        Welcome to your AeroLogger profile! Build your own social profile to
        connect with more pilots around the globe.
      </h2>
    </div>
    <MidScreen>
      <form on:submit|preventDefault={submit}>
        <div class="card m-auto w-md-50 my-5">
          <div class="card-body">
            <div class="mb-3 form-floating">
              <input
                type="text"
                class="form-control"
                id="username"
                placeholder="Your username"
                bind:value={username}
              />
              <label for="username"
                >Username <span class="text-danger">*</span></label
              >
              <div class="form-text">
                Your username must be unique, and only contain letters from the
                latin alphabet and numbers.
              </div>
            </div>
            <div class="mb-3 form-floating">
              <input
                type="text"
                class="form-control"
                id="displayname"
                placeholder="Your public name"
                bind:value={displayName}
              />
              <label for="displayname"
                >Display Name <span class="text-danger">*</span></label
              >
              <div class="form-text">
                The name you will be publicly known as.
              </div>
            </div>
            <div class="mb-3">
              <label for="birthday" class="form-label">Birthday</label>
              <input
                type="date"
                class="form-control is"
                id="birthday"
                bind:value={birthday}
              />
              <div class="form-text">
                Your birthday will be public. This field is not required.
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button
              {disabled}
              type="submit"
              class="btn btn-primary btn-lg w-100">Edit Profile</button
            >
          </div>
        </div>
      </form>
    </MidScreen>
  </div>
</main>

<ToastSetup {toast} />

<style>
  @media (min-width: 600px) {
    div.card {
      width: 600px;
    }
  }
</style>
