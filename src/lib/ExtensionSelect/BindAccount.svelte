<script lang="ts">
  import { provider } from "../stores";
  import type { Provider as BodhiProvider } from "@acala-network/bodhi";
  import { web3FromAddress } from "@polkadot/extension-dapp";

  import LoadingIcon from "../../assets/icons/loading.svg";

  export let bindAddress: string;
  export let clearBindAddress: () => void;

  let loading = false;

  const bindDefault = async () => {
    loading = true;
    const api = ($provider?.provider as BodhiProvider).api;

    const injector = await web3FromAddress(bindAddress!);

    try {
      await api.tx.evmAccounts
        .claimDefaultAccount()
        .signAndSend(bindAddress!, { signer: injector.signer as any });

      clearBindAddress();
    } catch {
      // TODO: show error
    }

    loading = false;
  };
</script>

<div class="flex flex-col justify-center items-center gap-4">
  <div class="text-3xl font-semibold dark:text-white">No EVM Address Found</div>
  <div class="w-80 text-center dark:text-white mb-4">
    In order to use a Substrate based account with the EVM+ you must first bind
    it to an EVM address
  </div>
  <div
    on:click={bindDefault}
    class="flex flex-row justify-center items-center gap-2 w-full h-16 bg-acala-600 dark:bg-primary-800 rounded-lg cursor-pointer text-2xl text-white font-semibold"
  >
    {#if loading}
      <img class="animate-spin" src={LoadingIcon} alt="loading" />
    {:else}
      Claim Default
    {/if}
  </div>
  <a
    href="https://acala-evm.netlify.app/"
    class="flex flex-row justify-center items-center gap-2 w-full h-16 bg-acala-600 dark:bg-primary-800 rounded-lg cursor-pointer text-2xl font-semibold text-white"
  >
    Bind Existing
  </a>
</div>
