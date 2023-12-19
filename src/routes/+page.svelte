<script>
  import Card from "$lib/components/Card.svelte";
  import Container from "$lib/components/Container.svelte";
  import FormInput from "$lib/components/FormInput.svelte";
  import ToastSetup from "$lib/components/ToastSetup.svelte";
  import { hrefs } from "$lib/index.js";
  import { createToast, fetchFromEndpoint } from "../hooks.client.js";
  export let data;
  const { session } = data;
  const cards = [
    {
      title: "Easy Flight Logging",
      details: [
        "To log a flight, simply go to the new flight page, and fill out the simple form, and your logbook will automatically get the most information about your time in the air.",
        "Your logbook automatically counts your hours for you, and display your data in a user-friendly way.",
      ],
    },
    {
      title: "Free and Secure",
      details: [
        "AeroLogger is a completely free service, with the source code available on Github.",
        "Enjoy a user-friendly experience with no intrusive advertisements.",
        "Make your flight logs public or private to the public.",
      ],
    },
    {
      title: "Notices",
      details: [
        "AeroLogger may or may not stay open source in the future.",
        "AeroLogger is still a demo project, nothing is 100% complete.",
        "Please do not share sensitive information with AeroLogger.",
        "While the public may not see any users logs (unless deemed public by the user), trusted admins have access to each log, regardless of its public status.",
      ],
    },
  ];
  let toast;
  async function contact() {
    progress = true;
    await fetchFromEndpoint("https://formspree.io/f/mgejprlb", {
      email: contactEmail,
      name: contactName,
      topic: contactTopic,
      message: contactMessage,
    });
    progress = false;
    toast = createToast(
      "success",
      "Message Sent",
      "Thank you for your feedback"
    );
  }
  let progress = false;
  let contactEmail = session ? session.user.email : "";
  let contactName = "";
  let contactTopic = "";
  let contactMessage = "";
</script>

<main>
  <Container>
    <div class="grid sm:grid-cols-2 gap-2 mb-24">
      <div>
        <h1 class="text-6xl">
          Hello <span class="text-primary">Pilot</span>.
        </h1>
        <h2 class="text-4xl">What would you like to do today?</h2>
      </div>
      <div class="grid grid-cols-2 gap-10 place-content-center mt-3 sm:mt-0">
        {#if session}
          <div>
            <a href={hrefs.logbook.link} class="btn btn-secondary w-full btn-lg"
              >View Logbook</a
            >
          </div>
          <div>
            <a href={hrefs.newflight.link} class="btn btn-primary w-full btn-lg"
              >Log New Flight</a
            >
          </div>
        {:else}
          <div>
            <a href={hrefs.explore.link} class="btn btn-secondary w-full btn-lg"
              >Explore</a
            >
          </div>
          <div>
            <a href={hrefs.signup.link} class="btn btn-primary w-full btn-lg"
              >Sign Up</a
            >
          </div>
        {/if}
      </div>
    </div>
    <div>
      <h1 class="text-4xl mb-10 font-bold">About AeroLogger</h1>
      <div
        class="grid place-content-center md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {#each cards as card}
          <Card
            background="bg-base-200"
            title={card.title}
            list={card.details}
            actions={false}
          ></Card>
        {/each}
      </div>
    </div>
    <div class="my-5 text-xl">
      <Card
        on:submit={contact}
        title="Contact Form"
        buttonText="Submit"
        disabled={progress}
        wider
      >
        <div class="mb-3">
          <label for="contactEmail" class="label">Email</label>
          <FormInput
            id="contactEmail"
            type="email"
            text="Incase I need to get back to you"
            placeholder="darthvader@tatooine.com"
            bind:value={contactEmail}
            required
          ></FormInput>
        </div>
        <div class="mb-3">
          <label for="contactName" class="label">Name</label>
          <FormInput
            id="contactName"
            placeholder="Darth Vader"
            bind:value={contactName}
            required
          ></FormInput>
        </div>
        <div class="mb-3">
          <label for="contactTopic" class="label">Topic</label>
          <FormInput
            id="contactTopic"
            placeholder="I am your father"
            required
            bind:value={contactTopic}
          ></FormInput>
        </div>
        <div class="mb-3">
          <label for="contactMessage" class="label">Message</label>
          <FormInput
            id="contactMessage"
            type="textarea"
            rows="5"
            max="10000"
            bind:value={contactMessage}
            required
          ></FormInput>
        </div>
      </Card>
    </div>
  </Container>
</main>

<ToastSetup {toast}></ToastSetup>
