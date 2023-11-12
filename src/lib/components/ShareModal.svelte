<script>
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
    subject: "Check out Aerologger",
    body: `${shareText} ${url.href}`,
  });
</script>

<div
  class="modal fade"
  {id}
  tabindex="-1"
  aria-labelledby={`${id}Label`}
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id={`${id}Label`}>Share</h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <h5>Link</h5>
          <div class="input-group">
            <button class="btn btn-primary" on:click={copy}
              ><i class="fa-solid fa-copy" /></button
            >
            <input
              type="text"
              class="form-control"
              bind:value={copyText}
              disabled
            />
          </div>
        </div>
        <div class="mb-3">
          <h5>Other</h5>
          <div class="d-flex justify-content-around">
            <a href={twitterLink} class="text-reset fs-4" title="X/Twitter"
              ><i class="fa-brands fa-x-twitter" /></a
            >
            <a href={mailLink} class="text-reset fs-4" title="Email"
              ><i class="fa-solid fa-envelope" /></a
            >
          </div>
        </div>
        <div><slot /></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Close</button
        >
      </div>
    </div>
  </div>
</div>
