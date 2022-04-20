<script lang="ts">
  import { providers, Signer } from "ethers";
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
    } catch (e) {
      console.log(e);
    }
  };

  const onSwapClicked = async () => {
    loading = true;

    if ($accountInfo.signer) {
      const transaction = await $accountInfo.makeSwap();
      transaction.wait().then((_value) => {
        $accountInfo.fromTokenAmount = "";
        $accountInfo.toTokenAmount = "";
        setShowToast("success", "TX Success");
        loading = false;
      });
    } else {
      await connectWallet();
      loading = false;
    }
  };
</script>

<div
  class={`flex flex-col justify-center items-center gap-2 w-[448px] p-2 bg-base-800 rounded-xl shadow-xl transition-height`}
>
  <DexInput from />
  <DexInput />

  <div class="flex flex-row justify-between items-center w-full">
    <TokenRatio />
    <div
      on:click={() => (showAdvanced = !showAdvanced)}
      class="p-1 rounded-full hover:bg-gray-500 cursor-pointer"
    >
      <img src={cogIcon} alt="advanced" />
    </div>
  </div>

  {#if showAdvanced}
    <Advanced />
  {/if}

  <div
    class={`flex justify-center items-center w-full h-16 text-white text-2xl font-semibold rounded-xl bg-primary-900 hover:bg-primary-800 transition-all ${
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
