<script lang="ts">
  import { accountInfo } from "./stores/accountInfo";
  import DexInput from "./DexInput.svelte";
  import TokenRatio from "./TokenRatio.svelte";
  import Advanced from "./Advanced.svelte";
  import cogIcon from "../assets/icons/cog.svg";
  import loadingIcon from "../assets/icons/loading.svg";
  import arrowIcon from "../assets/icons/arrow.svg";

  export let setShowToast: (
    type: "error" | "success",
    title: string,
    details?: string
  ) => void;

  let showAdvanced = false;
  let loading = false;

  const connectWallet = async () => {
    try {
      await $accountInfo.provider.send("eth_requestAccounts", []);
      $accountInfo.signer = $accountInfo.provider.getSigner();
    } catch (e: any) {
      setShowToast("error", "Could not Connect", e.message);
    } finally {
      loading = false;
    }
  };

  const onSwapClicked = async () => {
    loading = true;
    if ($accountInfo.signer) {
      try {
        const transaction = await $accountInfo.makeSwap();
        transaction
          .wait()
          .then((_value) => {
            $accountInfo.fromTokenAmount = "";
            $accountInfo.toTokenAmount = "";
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
      await connectWallet();
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
        let toToken = $accountInfo.toToken;
        $accountInfo.toToken = $accountInfo.fromToken;
        $accountInfo.fromToken = toToken;
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
    {:else if !$accountInfo.signer}
      Connect Extension
    {:else}
      Swap
    {/if}
  </div>
</div>
