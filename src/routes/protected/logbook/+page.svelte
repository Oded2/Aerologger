<script>
  import Logbook from "../../../components/Logbook.svelte";
  import MidScreen from "../../../components/MidScreen.svelte";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  import { createToast } from "../../../hooks.client.js";
  export let data;
  const { supabase, session } = data;
  let { logs } = data;
  let toast;
  let inProgress = false;
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
      .eq("user_id", session.user.id);
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    for (const i in logs) {
      logs[i].public = toPublic;
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
      .eq("user_id", session.user.id);
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    logs = [];
    toast = createToast(
      "success",
      "Success",
      "All your logs have been deleted from your logbook"
    );
  }
</script>

<main>
  <div class="container mt-5 font-google-gabarito">
    <h1>
      Welcome to your <span class="text-aerologger">logbook</span>.
    </h1>
  </div>
  <Logbook {logs} {supabase} />
  <div class="container my-5">
    <MidScreen
      ><div class="card shadow">
        <div class="card-header">
          <span class="font-google-quicksand">Logbook settings</span>
        </div>
        <div class="card-body">
          <div class="my-3">
            <h5>Privacy</h5>
            <div class="row">
              <div class="col-sm mb-3">
                <button
                  class="btn btn-dark w-100 shadow"
                  on:click={() => changeVisibility(false)}
                  disabled={inProgress}>Make Logs Private</button
                >
              </div>
              <div class="col-sm mb-3">
                <button
                  class="btn btn-dark w-100 shadow"
                  on:click={() => changeVisibility(true)}
                  disabled={inProgress}>Make Logs Public</button
                >
              </div>
            </div>
          </div>
          <div class="mb-3">
            <h5>Danger Zone</h5>
            <div>
              <button class="btn btn-outline-danger w-100" on:click={purge}
                >Purge Logbook</button
              >
            </div>
          </div>
        </div>
      </div>
    </MidScreen>
  </div>
</main>
<ToastSetup {toast} />
