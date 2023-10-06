<script>
  import { onMount } from "svelte";
  import hrefs from "../../data/hrefs.json";
  import { createToast, getUserDetails } from "../../hooks.client.js";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  export let data;
  const api = data.sbApi;
  const url = data.url;
  const mail = hrefs.contact.home.mail;
  let email = "",
    name = "",
    topic = "",
    message = "";
  let inProgress = false;
  let toast;
  onMount(autoFill);
  async function onSubmit() {
    if (!verify()) {
      return;
    }
    inProgress = true;
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          topic,
          message,
        }),
      });
      toast = createToast("success", "Success", "Message sent successfully");
    } catch {
      toast = createToast(
        "error",
        "Form not submitted",
        "There was an unexpected error"
      );
    }
    inProgress = false;
    clearValues();
  }
  function clearValues() {
    topic = "";
    message = "";
  }
  async function autoFill() {
    const userDetails = await getUserDetails(api);
    if (!userDetails) {
      return;
    }
    email = userDetails.email;
    name = `${userDetails.fname} ${userDetails.lname}`;
  }
  function verify() {
    function errorToast(desc) {
      toast = createToast("error", "Error", desc);
    }
    if (email.length == 0) {
      errorToast("Email cannot be empty");
      return false;
    }
    if (name.length == 0) {
      errorToast("Name cannot be empty");
      return false;
    }
    if (topic.length == 0) {
      errorToast("Topic cannot be empty");
      return false;
    }
    if (message.length == 0) {
      errorToast("Message cannot be empty");
      return false;
    }
    return true;
  }
</script>

<main>
  <div class="container mt-3 mb-5">
    <form on:submit|preventDefault={onSubmit} novalidate>
      <div class="card shadow-lg">
        <div class="card-header">
          <h1 class="font-google-quicksand fw-bold text-center">Contact</h1>
          <span class="form-text">
            You can also contact me directly at <a
              class="link-secondary"
              href={`mailto:${mail}`}>{mail}</a
            >.
          </span>
        </div>
        <div class="card-body">
          <div class="card-text mt-2">
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Email</h4>
              <input
                placeholder="someone@domain.com"
                type="email"
                bind:value={email}
                class="form-control"
                required
              />
              <p class="form-text">Incase I need to get back to you.</p>
            </div>
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Name</h4>
              <input
                type="text"
                bind:value={name}
                class="form-control"
                required
              />
            </div>
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Topic</h4>
              <input
                type="text"
                bind:value={topic}
                class="form-control"
                required
              />
            </div>
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Message</h4>
              <textarea
                cols="30"
                rows="10"
                bind:value={message}
                class="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-center">
          <button
            class="btn btn-primary w-75 fs-5 fw-bold"
            type="submit"
            disabled={inProgress}
            ><i class="fa-solid fa-paper-plane" />&nbsp; Send</button
          >
        </div>
      </div>
    </form>
  </div>
</main>

<ToastSetup {toast} />
