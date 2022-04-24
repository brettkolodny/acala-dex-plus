<script lang="ts">
  import { provider, signer } from "../stores";
  import type { providers } from "ethers";
  import {
    Provider as BodhiProvider,
    Signer as BodhiSigner,
  } from "@acala-network/bodhi";
  import {
    web3Enable,
    web3FromSource,
    web3FromAddress,
  } from "@polkadot/extension-dapp";
  import { cryptoWaitReady } from "@polkadot/util-crypto";
  import type { InjectedExtension } from "@polkadot/extension-inject/types";
  import AccountList from "./AccountList.svelte";
  import BindAccount from "./BindAccount.svelte";

  import MultiProvider from "../MultiProvider";
  import MetamaskLogo from "../../assets/icons/Metamask.svg";
  import TalismanLogo from "../../assets/icons/Talisman.svg";
  import PolkadotjsLogo from "../../assets/icons/Polkadot-js.svg";
  import LoadingIcon from "../../assets/icons/loading.svg";

  interface Account {
    name?: string;
    address: string;
  }

  export let close: () => void;

  let accounts: Account[] | null = null;
  let bodhiExtension: InjectedExtension | null;
  let bindAddress: string | null = null;
  let loading = false;
  let isTalisman = false;

  const connectMetamask = async () => {
    $provider = MultiProvider.createEthProvider();
    const ethProvider = $provider!.provider as providers.Web3Provider;
    await ethProvider.send("eth_requestAccounts", []);
    $signer = ethProvider.getSigner();
    close();
  };

  const connectSubstrate = async (extensionName: string) => {
    await cryptoWaitReady();
    await web3Enable("DEX+");
    const talisman = await web3FromSource(extensionName);
    bodhiExtension = talisman;
    const bodhiProvider = MultiProvider.createBodhiProvider();
    $provider = bodhiProvider;

    const injectedAccounts = await talisman.accounts.get();
    isTalisman = extensionName === "talisman";
    accounts = injectedAccounts.map((account) => ({
      name: account.name,
      address: account.address,
    }));
  };

  const createBodhiSigner = async (address: string) => {
    loading = true;
    const api = ($provider?.provider as BodhiProvider).api;
    await api.isReady;

    const evmAddress = (
      await api.query.evmAccounts.evmAddresses(address)
    ).toHuman();

    loading = false;

    if (evmAddress) {
      const bodhiSigner = new BodhiSigner(
        $provider?.provider as any,
        address,
        bodhiExtension?.signer as any
      );

      $signer = bodhiSigner;
      close();
    } else {
      bindAddress = address;
    }
  };
</script>

<div
  class="absolute top-0 left-0 flex justify-center items-center w-screen h-screen bg-black bg-opacity-50 z-20"
>
  <div class="p-2 rounded-xl bg-base-200 dark:bg-base-800">
    <div
      class="flex flex-col justify-center items-center gap-3 shadow-inner-input p-4 rounded-xl"
    >
      {#if loading}
        <div
          class="flex flex-row justify-center items-center gap-2 w-64 h-12 bg-acala-400 dark:bg-primary-700 rounded-xl"
        >
          <div class="text-xl text-white font-semibold">Connecting</div>
          <img class="animate-spin" src={LoadingIcon} alt="loading" />
        </div>
      {:else if bindAddress}
        <BindAccount
          {bindAddress}
          clearBindAddress={() => (bindAddress = null)}
        />
      {:else if accounts && accounts.length > 0}
        <AccountList {accounts} {createBodhiSigner} {isTalisman} />
      {:else if accounts}
        <div>No accounts</div>
      {:else}
        <div
          on:click={() => connectSubstrate("talisman")}
          class="flex justify-center items-center w-64 h-12 bg-white dark:bg-base-100 rounded-lg cursor-pointer"
        >
          <img class="h-8" src={TalismanLogo} alt="talisman" />
        </div>
        <div
          on:click={() => connectSubstrate("polkadot-js")}
          class="flex justify-center items-center w-64 h-12 bg-white dark:bg-base-100 rounded-lg cursor-pointer"
        >
          <img class="h-8" src={PolkadotjsLogo} alt="polkadot-js" />
        </div>
        <div
          on:click={connectMetamask}
          class="flex justify-center items-center w-64 h-12 bg-white dark:bg-base-100 rounded-lg cursor-pointer"
        >
          <img class="h-8" src={MetamaskLogo} alt="metamask" />
        </div>
      {/if}
    </div>
  </div>
</div>
