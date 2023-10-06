<script>
  import { page } from "$app/stores";
  import { addParamsString, copyToClipboard } from "../hooks.client.js";
  import Modal from "./Modal.svelte";
  export let showModal = false;
  export const url = $page.url;
  export let shareText =
    "Check out AeroLogger, a fast, free, and convenient flight logging website.";
  let href = url.href;
  function copy() {
    copyToClipboard(href);
    href = "Link copied to clipboard";
    setTimeout(() => (href = url.href), 3000);
  }
  const twitterLink = addParamsString("https://twitter.com/intent/tweet", {
    text: shareText,
    url: url.href,
    hashtags: ["aerologger"],
  });
  const mailLink = addParamsString("mailto:", {
    subject: "Check out Aerologger",
    body: `${shareText} ${url.href}`,
  });
</script>

<Modal on:click {showModal}
  ><div class="font-google-gabarito">
    <div class="text-center"><h1>Share</h1></div>
    <div class="p-5">
      <div class="input-group">
        <button class="input-group-text btn btn-primary fs-5" on:click={copy}
          >Copy Link</button
        >
        <input
          type="text"
          class="form-control fs-5"
          disabled
          bind:value={href}
        />
      </div>
      <div class="text-center my-3">
        <h2>Or</h2>
      </div>
      <div class="my-2 d-flex justify-content-around">
        <a class="btn btn-light btn-lg fs-1" href={twitterLink} target="_blank"
          ><i class="fa-brands fa-x-twitter" style="color: #000000;" /> Twitter /
          X
        </a>
        <a class="btn btn-light btn-lg fs-1" href={mailLink} target="_blank"
          ><i class="fa-solid fa-envelope" /> Email
        </a>
      </div>
    </div>
  </div>
</Modal>
