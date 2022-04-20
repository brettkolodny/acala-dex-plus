<script lang="ts">
  import { accountInfo } from "./stores/accountInfo";
  import DexInput from "./DexInput.svelte";
  import TokenRatio from "./TokenRatio.svelte";
  import Advanced from "./Advanced.svelte";
  import cogIcon from "../assets/icons/cog.svg";
  import loadingIcon from "../assets/icons/loading.svg";

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
  class={`flex flex-col justify-center items-center gap-2 w-[448px] p-2 bg-white dark:bg-base-800 rounded-xl shadow-xl transition-height`}
>
  <DexInput from />
  <DexInput />

  <div class="flex flex-row justify-between items-center w-full">
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
