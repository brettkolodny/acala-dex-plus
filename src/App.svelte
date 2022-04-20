<script lang="ts">
  import { setContext } from "svelte";
  import { Chain } from "./lib/tokens";
  import Dex from "./lib/Dex.svelte";
  import Toast from "./lib/Toast.svelte";

  let showToast = false;
  let toastTitle = "";
  let toastDetails: string | undefined = "";
  let toastType: "success" | "error" = "success";

  const setShowToast = (
    type: "error" | "success",
    title: string,
    details?: string
  ) => {
    toastType = type;
    toastTitle = title;
    toastDetails = details;
    showToast = true;

    setTimeout(() => (showToast = false), 5000);
  };

  setContext("chain", Chain.MANDALA);
</script>

<main
  class="flex flex-col justify-start items-center h-screen w-screen bg-gradient-to-br from-primary-700 to-base-900 pt-80"
>
  {#if showToast}
    <Toast type={toastType} title={toastTitle} details={toastDetails} />
  {/if}
  <Dex {setShowToast} />
</main>
