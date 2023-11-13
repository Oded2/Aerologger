<script>
  import hrefs from "$lib/hrefs.json";
  import {
    createToast,
    dateToStr,
    hasNormalCharacters,
  } from "../../../hooks.client.js";
  import ToastSetup from "$lib/components/ToastSetup.svelte";
  export let data;
  const { supabase, session, profile } = data;
  let toast;
  let email = session.user.email;
  let displayName = profile ? profile.display_name : "";
  let username = profile ? profile.username : "";
  let bio = profile ? profile.bio : "";
  let birthday = profile
    ? profile.birthday
      ? dateToStr(new Date(profile.birthday))
      : null
    : null;
  let og = { email, displayName, username, bio, birthday };
  let inProgress = false;
  const maxlength = 50;
  $: accountChange = email !== og.email;
  $: profileChange =
    displayName !== og.displayName ||
    username !== og.username ||
    bio !== og.bio ||
    birthday !== og.birthday;

  async function editProfile() {
    if (!verifyInput(username, "Username")) {
      return;
    }
    if (!hasNormalCharacters(username)) {
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
      bio,
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
    og.bio = bio;
    og.birthday = birthday;
    toast = createToast(
      "success",
      "Success",
      "Your AeroLogger profile has been updated."
    );
  }
  async function editAccount() {
    if (!email || email.length == 0) {
      createToast("error", "Invalid Email", "Email cannot be empty");
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
    if (value.length > maxlength) {
      toast = createToast(
        "error",
        `Invalid ${name}`,
        `${name} cannot be more than ${maxlength} characters long`
      );
      return false;
    }
    return true;
  }
</script>

<main>
  <div class="container my-5">
    <div class="font-google-gabarito">
      <h1>Welcome back.</h1>
      <h5 class="fw-normal">
        User Id: {session.user.id}
      </h5>
    </div>
    <div class="row">
      <div class="col-lg-6 mb-5">
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
                  on:blur={() => (email = email.trim())}
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
      <div class="col-lg-6 mb-5">
        <form on:submit|preventDefault={editProfile} class="h-100">
          <div class="card shadow my-5 h-100">
            <div class="card-header">
              <span class="font-google-quicksand"
                >Profile Settings - <a
                  href={hrefs.explore.profile.link.replace("slug", og.username)}
                  >View Profile</a
                ></span
              >
            </div>
            <div class="card-body">
              <div class="mb-3 form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  placeholder="Your username"
                  bind:value={username}
                  on:blur={() => (username = username.trim())}
                  required
                  {maxlength}
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
                  on:blur={() => (displayName = displayName.trim())}
                  required
                  {maxlength}
                />
                <label for="displayname"
                  >Display Name <span class="text-danger">*</span></label
                >
                <div class="form-text">
                  The name you will be publicly known as.
                </div>
              </div>
              <div class="mb-3">
                <div class="input-group">
                  <div class="form-floating">
                    <input
                      type="text"
                      class="form-control"
                      id="bio"
                      placeholder="Your profile bio"
                      bind:value={bio}
                      on:blur={() => (bio = bio.trim())}
                      maxlength="150"
                    />
                    <label for="bio">Bio</label>
                  </div>
                  <button
                    type="button"
                    class="input-group-text btn btn-secondary"
                    on:click={() => (bio = "")}
                    disabled={bio.length == 0}
                    ><i class="fa-solid fa-x" /></button
                  >
                </div>
                <div class="form-text">{`${bio.length}/150`}</div>
              </div>
              <div class="mb-3">
                <div class=" input-group">
                  <div class="form-floating">
                    <input
                      type="date"
                      class="form-control"
                      id="birthday"
                      bind:value={birthday}
                      max={dateToStr()}
                      placeholder="Birthday"
                    />

                    <label for="birthday">Birthday</label>
                  </div>
                  <button
                    type="button"
                    class="input-group-text btn btn-secondary"
                    on:click={() => (birthday = null)}
                    disabled={!birthday}><i class="fa-solid fa-x" /></button
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
