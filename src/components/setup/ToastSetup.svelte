<script>
  import { FlatToast, ToastContainer } from "svelte-toasts";
  export let toast;
</script>

<ToastContainer><FlatToast data={toast} /></ToastContainer>
