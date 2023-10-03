<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  function clicked() {
    dispatch("checked", checked);
  }
  export let checked = true;
</script>

<input
  type="checkbox"
  class="checkbox"
  id="night-mode"
  bind:checked
  on:change={clicked}
/>
<label for="night-mode" class="label">
  <i class="fas fa-moon" />
  <i class="fas fa-sun" />
  <div class="blob" />
</label>

<style>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .label {
    background-color: black;
    display: flex;
    height: 30px;
    border-radius: 50px;
    width: 100px;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 0 15px;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    border: 2px solid black;
  }
  .label .fa-moon {
    color: rgb(250, 250, 250);
  }
  label .fa-sun {
    color: rgb(243, 188, 36);
  }
  .blob {
    position: absolute;
    left: 50%;
    width: 50%;
    height: 100%;
    background: rgb(169, 241, 243);
    border-radius: 50px;
    transition: 0.5s ease all;
  }
  .checkbox {
    opacity: 0;
    position: absolute;
  }

  .checkbox:checked + .label .blob {
    left: 0;
  }
  .checkbox:checked + .label {
    background-color: rgb(82, 81, 83);
  }
</style>
