<script>
  import Modal from "$lib/components/Modal.svelte";
  import { page } from "$app/stores";
  import { addParamsString } from "../../hooks.client.js";
  export let id = "";
  export let url = $page.url;
  export let shareText =
    "Check out AeroLogger, a fast, free, and convenient flight logging website.";
  let copyText = url.href;
  function copy() {
    navigator.clipboard.writeText(url.href);
    copyText = "Link copied to clipboard";
    setTimeout(() => (copyText = url.href), 3000);
  }
  const twitterLink = addParamsString("https://twitter.com/intent/tweet", {
    text: shareText,
    url: url.href,
    hashtags: ["aerologger"],
  });
  const mailLink = addParamsString("mailto:", {
    subject: "Check out AeroLogger",
    body: `${shareText} ${url.href}`,
  });
</script>

<Modal title="Share" {id}>
  <div class="grid gap-4">
    <div class="join w-full">
      <input
        type="text"
        bind:value={copyText}
        class="join-item input w-full"
        disabled
      />
      <button class="btn btn-primary join-item" on:click={copy}
        ><i class="fa-solid fa-copy"></i></button
      >
    </div>
    <div>
      <slot />
    </div>
  </div>
</Modal>
