<script>
  export let title = "";
  export let className = "btn m-1";
</script>

<div class="dropdown dropdown-end">
  <div tabindex="0" role="button" class={className}>{title}</div>
  <ul
    class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
  >
    <slot />
  </ul>
</div>
