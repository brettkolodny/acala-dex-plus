<script lang="ts">
  import {
    signer,
    provider,
    fromTokenAmount,
    toTokenAmount,
    toToken,
    fromToken,
    transactionCount,
  } from "./stores";
  import DexInput from "./DexInput.svelte";
  import TokenRatio from "./TokenRatio.svelte";
  import Advanced from "./Advanced.svelte";
  import cogIcon from "../assets/icons/cog.svg";
  import loadingIcon from "../assets/icons/loading.svg";
  import arrowIcon from "../assets/icons/arrow.svg";
  import { makeSwap } from "./Web3.svelte";

  export let setShowToast: (
    type: "error" | "success",
    title: string,
    details?: string
  ) => void;

  export let showExtensionSelect: () => void;

  let showAdvanced = false;
  let loading = false;

  const onSwapClicked = async () => {
    if ($signer) {
      loading = true;
      try {
        const transaction = await makeSwap();
        transaction
          .wait()
          .then((_value) => {
            $fromTokenAmount = "";
            $toTokenAmount = "";
            $transactionCount += 1;
            setShowToast("success", "TX Success");
          })
          .catch((reason: any) => {
            setShowToast("error", "TX Failed", reason.message);
          })
          .finally(() => (loading = false));
      } catch (e: any) {
        let message: string | undefined;

        if (
          e.message ===
          "MetaMask Tx Signature: User denied transaction signature."
        ) {
          message = "Transaction cancelled.";
        } else {
          message = e.message;
        }
        setShowToast("error", "TX Failed", message);
        loading = false;
      }
    } else {
      showExtensionSelect();
    }
  };
</script>

<div
  class={`flex flex-col justify-center items-center gap-1 w-[448px] p-2 bg-white dark:bg-base-800 rounded-xl shadow-xl transition-height`}
>
  <DexInput from />

  <div
    class="relative flex justify-center items-center h-0 overflow-visible z-10"
  >
    <div
      on:click={() => {
        let _toToken = $toToken;
        $toToken = $fromToken;
        $fromToken = _toToken;
      }}
      class="flex flex-col justify-end items-center w-8 h-8 rounded-md bg-white dark:bg-base-800 cursor-pointer"
    >
      <div class="absolute w-full h-2 shadow-md" />
      <img src={arrowIcon} alt="switch tokens" class="w-full h-full p-2" />
    </div>
  </div>

  <DexInput />

  <div class="flex flex-row justify-between items-center w-full h-6 my-1">
    <TokenRatio />
    <div
      on:click={() => (showAdvanced = !showAdvanced)}
      class="flex justify-center items-center p-1 rounded-full hover:border dark:hover:border-none dark:hover:bg-gray-500 cursor-pointer h-4"
    >
      <img src={cogIcon} alt="advanced" />
    </div>
  </div>

  {#if showAdvanced}
    <Advanced />
  {/if}

  <div
    class={`flex justify-center items-center w-full h-16 text-white text-2xl font-semibold rounded-xl bg-acala-600 hover:bg-acala-800 dark:bg-primary-900 dark:hover:bg-primary-800 transition-all ${
      loading ? "cursor-not-allowed" : "cursor-pointer"
    }`}
    on:click={onSwapClicked}
  >
    {#if loading}
      <img src={loadingIcon} class="animate-spin w-8" alt="loading" />
    {:else if !$signer}
      Connect Extension
    {:else}
      Swap
    {/if}
  </div>
</div>
