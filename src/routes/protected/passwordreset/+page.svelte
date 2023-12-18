<script>
  import { goto } from "$app/navigation";
  import Card from "$lib/components/Card.svelte";
  import Container from "$lib/components/Container.svelte";
  import FormInput from "$lib/components/FormInput.svelte";
  import ToastSetup from "$lib/components/ToastSetup.svelte";
  import { hrefs } from "$lib/index.js";
  import { createToast } from "../../../hooks.client.js";
  export let data;
  const { supabase } = data;
  let toast;
  let password = "",
    confirmPass = "";
  let inProgress = false;
  function showErrorToast(desc) {
    toast = createToast("error", "Error", desc);
  }
  function verify() {
    if (password !== confirmPass) {
      showErrorToast("Passwords must match.");
      return false;
    }
    if (password.length < 8) {
      showErrorToast("Password must be at least 8 characters long.");
      return false;
    }
    return true;
  }
  async function submit() {
    if (!verify()) {
      return;
    }
    inProgress = true;
    const { error } = await supabase.auth.updateUser({ password: password });
    if (error) {
      inProgress = false;
      showErrorToast(error.message);
      return;
    }
    toast = createToast(
      "success",
      "Password Reset",
      "You will be automatically redirected in 5 seconds."
    );
    setTimeout(() => {
      goto(hrefs.home.link);
    }, 5000);
  }
</script>

<main>
  <Container>
    <Card
      on:submit={submit}
      marginAuto
      title="Password Reset"
      buttonText="Reset Password"
      disabled={inProgress}
    >
      <div class="text-xl">
        <div class="mb-3">
          <label for="password" class="label">Password</label>
          <FormInput
            id="password"
            bind:value={password}
            required
            type="password"
            min="8"
            max="50"
            text="Must be between 8 to 50 charactersl long."
          />
        </div>
        <div class="mb-3">
          <label for="confirmpass" class="label">
            <span
              >Confirm New Password
              {#if password == confirmPass}
                <i class="fa-solid fa-circle-check" style="color: #198754;" />
              {:else}
                <i class="fa-solid fa-circle-xmark" style="color: #dc3545;" />
              {/if}
            </span>
          </label>
          <FormInput
            id="confirmpass"
            bind:value={confirmPass}
            required
            type="password"
            min="8"
            max="50"
          />
        </div>
      </div>
    </Card>-
  </Container>
</main>

<ToastSetup {toast} />
