<script lang="ts">
  import { setContext } from "svelte";
  import { Chain } from "./lib/tokens";
  import Dex from "./lib/Dex.svelte";
  import Toast from "./lib/Toast.svelte";
  import Account from "./lib/Account.svelte";
  import ExtensionSelect from "./lib/ExtensionSelect/ExtensionSelect.svelte";

  let showExtensionSelect = false;
  let showToast = false;
  let toastTitle = "TX Success";
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
</script>

<main
  class="flex flex-col justify-start items-center h-screen w-screen bg-gradient-to-br from-acala-700 to-white dark:from-primary-700 dark:to-base-900 pt-80"
>
  {#if showExtensionSelect}
    <ExtensionSelect close={() => (showExtensionSelect = false)} />
  {/if}
  <Account />
  {#if showToast}
    <Toast type={toastType} title={toastTitle} details={toastDetails} />
  {/if}
  <Dex
    {setShowToast}
    showExtensionSelect={() => (showExtensionSelect = true)}
  />
</main>
