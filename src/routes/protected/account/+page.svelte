<script>
  import hrefs from "../../../data/hrefs.json";
  import { createToast, dateToStr } from "../../../hooks.client.js";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  export let data;
  const { supabase, session, profile } = data;
  let toast;
  let email = session.user.email;
  let displayName = profile ? profile.display_name : "";
  let username = profile ? profile.username : "";
  let birthday = profile
    ? profile.birthday
      ? dateToStr(new Date(profile.birthday))
      : null
    : null;
  let og = { email, displayName, username, birthday };
  let inProgress = false;
  $: accountChange = email !== og.email;
  $: profileChange =
    displayName !== og.displayName ||
    username !== og.username ||
    birthday !== og.birthday;

  async function editProfile() {
    if (!verifyInput(username, "Username")) {
      return;
    }
    if (!validString(username)) {
      toast = createToast(
        "error",
        "Invalid Username",
        "Username cannot have special characters."
      );
      return;
    }
    if (!verifyInput(displayName, "Display Name")) {
      return;
    }
    if (birthday && new Date(birthday).valueOf() > new Date().valueOf()) {
      toast = createToast(
        "error",
        "Invalid Birthday",
        "Birthday cannot be after today"
      );
      return;
    }
    inProgress = true;
    const { error } = await supabase.from("Profiles").upsert({
      user_id: session.user.id,
      username: username,
      display_name: displayName,
      birthday: birthday ? new Date(birthday).toISOString() : null,
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
    og.displayName = displayName;
    og.username = username;
    og.birthday = birthday;
    toast = createToast(
      "success",
      "Success",
      "Your AeroLogger profile has been updated."
    );
  }
  async function editAccount() {
    if (!verifyInput(email, "Email")) {
      return;
    }
    inProgress = true;
    const { error } = await supabase.auth.updateUser({ email: email });
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    og.email = email;
    toast = createToast(
      "info",
      "Check Email",
      `An email has been sent to ${email} with a verification link`
    );
  }
  function verifyInput(value = "", name = "") {
    if (!value || value.length == 0) {
      toast = createToast(
        "error",
        `Invalid ${name}`,
        `${name} cannot be empty`
      );
      return false;
    }
    if (value.length > 50) {
      toast = createToast(
        "error",
        `Invalid ${name}`,
        `${name} cannot be more than 50 characters long`
      );
      return false;
    }
    return true;
  }
  function validString(inputString = "") {
    return inputString.length == 0 ? true : /^[a-zA-Z0-9]+$/.test(inputString);
  }
</script>

<main>
  <div class="container my-5">
    <div class="font-google-gabarito">
      <h1>Welcome back.</h1>
    </div>
    <div class="row">
      <div class="col-lg mb-5">
        <form on:submit|preventDefault={editAccount} class="h-100">
          <div class="card shadow my-5 h-100">
            <div class="card-header">
              <span class="font-google-quicksand">Account Settings</span>
            </div>
            <div class="card-body">
              <div class="mb-3 form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="email"
                  placeholder="Your email"
                  bind:value={email}
                  required
                />
                <label for="email"
                  >Email <span class="text-danger">*</span></label
                >
                <div class="form-text">
                  You will be sent a verification email to your new email.
                </div>
              </div>
              <div class="mb-3">
                <a
                  href={hrefs.passwordreset.home.link}
                  class="btn btn-outline-danger btn-lg w-100">Reset Password</a
                >
              </div>
            </div>
            <div class="card-footer">
              <button
                disabled={inProgress || !accountChange}
                type="submit"
                class="btn btn-primary btn-lg w-100">Update Account</button
              >
            </div>
          </div>
        </form>
      </div>
      <div class="col-lg mb-5">
        <form on:submit|preventDefault={editProfile} class="h-100">
          <div class="card shadow my-5 h-100">
            <div class="card-header">
              <span class="font-google-quicksand">Profile Settings</span>
            </div>
            <div class="card-body">
              <div class="mb-3 form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  placeholder="Your username"
                  bind:value={username}
                  required
                />
                <label for="username"
                  >Username <span class="text-danger">*</span></label
                >
                <div class="form-text">
                  Your username must be unique, and only contain letters from
                  the latin alphabet and numbers.
                </div>
              </div>
              <div class="mb-3 form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="displayname"
                  placeholder="Your public name"
                  bind:value={displayName}
                  required
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
                <div class="input-group">
                  <input
                    type="date"
                    class="form-control is"
                    id="birthday"
                    bind:value={birthday}
                  />
                  <button
                    class="input-group-text btn btn-secondary"
                    on:click={() => {
                      birthday = null;
                      profileChange = true;
                    }}
                    disabled={!birthday}
                    type="button"><i class="fa-solid fa-x" /></button
                  >
                </div>
                <div class="form-text">
                  Your birthday will be public. This field is not required.
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button
                disabled={inProgress || !profileChange}
                type="submit"
                class="btn btn-primary btn-lg w-100">Update Profile</button
              >
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</main>

<ToastSetup {toast} />
