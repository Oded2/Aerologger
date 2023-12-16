<script>
  import { hrefs, oldHrefs } from "$lib/index.js";
  import {
    createToast,
    dateToStr,
    hasNormalCharacters,
  } from "../../../hooks.client.js";
  import ToastSetup from "$lib/components/ToastSetup.svelte";
  import Container from "$lib/components/Container.svelte";
  import Card from "$lib/components/Card.svelte";
  import Input from "$lib/components/Input.svelte";
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
  <Container>
    <div>
      <h1 class="text-4xl text-center sm:text-start">Welcome Back.</h1>
      <h5 class="text-xl text-center sm:text-start">
        User Id: {session.user.id}
      </h5>
    </div>
    <div class="grid md:grid-cols-2 gap-4 text-xl">
      <Card
        on:submit={editAccount}
        buttonText="Update Account"
        title="Account Settings"
        disabled={inProgress || !accountChange}
        marginAuto
      >
        <div>
          <label for="email" class="label">Email</label>
          <Input
            type="email"
            id="email"
            bind:value={email}
            required
            text="You will be sent a verification email to your new email."
          />
        </div>
        <div>
          <a
            href={hrefs.passwordreset.link}
            class="btn btn-error btn-outline w-full">Reset Password</a
          >
        </div>
      </Card>

      <Card
        on:submit={editProfile}
        buttonText="Update Profile"
        title="Profile Settings"
        disabled={inProgress || !profileChange}
        marginAuto
      >
        <div class="mb-3">
          <label for="username" class="label">Username</label>
          <Input
            id="username"
            required
            placeholder="Your username"
            bind:value={username}
            max="50"
          />
        </div>
        <div class="mb-3">
          <label for="displayName" class="label">Display Name</label>
          <Input
            id="displayName"
            required
            placeholder="Public display name"
            bind:value={displayName}
            max="50"
          />
        </div>
        <div class="mb-3">
          <label for="displayName" class="label">Bio</label>
          <Input
            id="displayName"
            required
            placeholder="Tell about yourself"
            bind:value={bio}
            max="150"
            text={`${bio.length}/${(150).toLocaleString()}`}
          />
        </div>
        <div class="mb-3">
          <label for="birthday" class="label">Birthday</label>
          <Input
            id="birthday"
            type="date"
            bind:value={bio}
            max={dateToStr()}
            text="Your birthday will be public. This field is not required."
          />
        </div>
      </Card>
    </div>
  </Container>
</main>

<ToastSetup {toast} />
