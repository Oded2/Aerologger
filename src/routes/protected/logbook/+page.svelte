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
    )
      return;

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
    for (const i in logs) logs[i].public = toPublic;

    toast = createToast(
      "success",
      "Success",
      `All your logs are now ${toPublic ? "public" : "private"}`
    );
  }
  async function purgePublic(isPublic = false) {
    if (
      !confirm(
        `This action will delete ALL of your ${
          isPublic ? "public" : "private"
        } logs. This action cannot be undone.`
      )
    )
      return;
    inProgress = true;
    const { error } = await supabase
      .from("Logs")
      .delete()
      .eq("public", isPublic)
      .eq("user_id", session.user.id);
    inProgress = false;
    if (error) {
      toast = createToast("error", "Error", error.message);
      return;
    }
    for (const i in logs) if (logs[i].public == isPublic) logs.splice(i, 1);
    logs = logs;
    toast = createToast(
      "success",
      "Success",
      `All ${
        isPublic ? "public" : "private"
      } logs are deleted from your logbook.`
    );
  }
  async function purge() {
    if (
      !confirm(
        "Are you sure you want to purge your logbook? This action will delete ALL your flight logs and CANNOT be undone."
      )
    )
      return;

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
  <Logbook
    {logs}
    {supabase}
    on:delete={() =>
      (toast = createToast(
        "success",
        "Flight Deleted",
        "Your flight has been deleted from your logbook."
      ))}
  />
  <div class="container my-5">
    {#if logs.length > 0}
      <MidScreen
        ><div class="card shadow">
          <div class="card-header">
            <span class="font-google-quicksand">Logbook settings</span>
          </div>
          <div class="card-body">
            <div class="my-3">
              <h5>Privacy</h5>
              <div class="row">
                <div class="col-sm-6 mb-3">
                  <button
                    class="btn btn-dark w-100 shadow"
                    on:click={() => changeVisibility(false)}
                    disabled={inProgress}>Make Logs Private</button
                  >
                </div>
                <div class="col-sm-6 mb-3">
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
              <div class="row">
                <div class="col-sm-6 mb-3">
                  <button
                    class="btn btn-outline-danger w-100 shadow"
                    on:click={() => purgePublic(false)}
                    disabled={inProgress}>Delete Private Logs</button
                  >
                </div>
                <div class="col-sm-6 mb-3">
                  <button
                    class="btn btn-outline-danger w-100 shadow"
                    on:click={() => purgePublic(true)}
                    disabled={inProgress}>Delete Public Logs</button
                  >
                </div>
                <div class="col-sm-12">
                  <button class="btn btn-danger w-100 shadow" on:click={purge}
                    >Purge Logbook</button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </MidScreen>
    {/if}
  </div>
</main>
<ToastSetup {toast} />
