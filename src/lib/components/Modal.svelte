<script>
  export let id = "";
  export let title = "";
  export let submit = false;
  export let disabled = false;
  export let submitText = "Submit";
  export let size = "";
</script>

<div
  class="modal fade"
  {id}
  tabindex="-1"
  aria-labelledby={`${id}Label`}
  aria-hidden="true"
>
  <div
    class="modal-dialog"
    class:modal-sm={size === "sm"}
    class:modal-lg={size === "lg"}
    class:modal-xl={size === "xl"}
  >
    <div class="modal-content">
      <form on:submit|preventDefault>
        <div class="modal-header">
          <h1 class="modal-title fs-5" id={`${id}Label`}>{title}</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body"><slot /></div>
        {#if submit}
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal">Close</button
            >
            <button type="submit" class="btn btn-primary" {disabled}
              >{submitText}</button
            >
          </div>
        {/if}
      </form>
    </div>
  </div>
</div>
