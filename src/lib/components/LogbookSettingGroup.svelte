<script>
  export let title = "";
</script>

<div>
  <h4 class="text-xl font-semibold mb-3">{title}</h4>
  <div class="grid md:grid-cols-12 gap-2">
    <slot />
  </div>
</div>
