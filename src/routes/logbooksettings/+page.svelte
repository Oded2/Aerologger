<script>
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  import { createToast } from "../../hooks.client.js";
  export let data;
  const { session } = data;
  const user = session ? session.user : false;
  const { supabase } = data;
  let inProgress = false;
  let toast;
  async function changeVisibility(toPublic = true) {
    if (
      !confirm(
        `This action will make all your logs ${
          toPublic ? "public" : "private"
        }. Are you sure you want to do this?`
      )
    ) {
      return;
    }
    inProgress = true;
    const { error } = await supabase
      .from("Logs")
      .update({ public: toPublic })
      .eq("user_id", user.id);
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    toast = createToast(
      "success",
      "Success",
      `All your logs are now ${toPublic ? "public" : "private"}`
    );
  }
  async function purge() {
    if (
      !confirm(
        "Are you sure you want to purge your logbook? This action will delete ALL your flight logs and CANNOT be undone."
      )
    ) {
      return;
    }
    inProgress = true;
    const { error } = await supabase
      .from("Logs")
      .delete()
      .eq("user_id", user.id);
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    toast = createToast(
      "success",
      "Success",
      "All your logs have been deleted from your logbook"
    );
  }
</script>

<main>
  <div class="container my-5 font-google-gabarito">
    <div class="border-bottom"><h2>Logbook Settings</h2></div>
    <div class="row mt-5">
      <div class="col-md-6 mb-3">
        <div class="card h-100">
          <div class="card-header"><h3>Privacy</h3></div>
          <div class="card-body">
            <div class="mb-2">
              <button
                disabled={inProgress}
                on:click={() => changeVisibility(false)}
                class="btn btn-outline-dark btn-lg w-100"
                >Make all logs private</button
              >
            </div>
            <div>
              <button
                disabled={inProgress}
                on:click={() => changeVisibility(true)}
                class="btn btn-outline-dark btn-lg w-100"
                >Make all logs public</button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <div class="card h-100">
          <div class="card-header"><h3>Danger Zone</h3></div>
          <div class="card-body">
            <div class="mb-2">
              <button
                disabled={inProgress}
                on:click={purge}
                class="btn btn-danger btn-lg w-100">Purge Logbook</button
              >
            </div>
            <div />
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<ToastSetup {toast} />
