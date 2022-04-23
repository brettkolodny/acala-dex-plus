<script lang="ts">
  import { provider, signer } from "./stores";
  import MetamaskLogo from "../assets/icons/Metamask.svg";
  import TalismanLogo from "../assets/icons/Talisman.svg";
  import MultiProvider from "./MultiProvider";
  import type { providers } from "ethers";
  import {
    Provider as BodhiProvider,
    Signer as BodhiSigner,
  } from "@acala-network/bodhi";
  import {
    web3Enable,
    web3FromSource,
  } from "@polkadot/extension-dapp";
  import { cryptoWaitReady } from "@polkadot/util-crypto";

  export let close: () => void;

  const connectMetamask = async () => {
    $provider = MultiProvider.createEthProvider();
    const ethProvider = $provider!.provider as providers.Web3Provider;
    await ethProvider.send("eth_requestAccounts", []);
    $signer = ethProvider.getSigner();
    close();
  };

  const connectTalisman = async () => {
    await cryptoWaitReady();
    const allInjected = await web3Enable("DEX+");
    const talisman = await web3FromSource("talisman");
    const bodhiProvider = MultiProvider.createBodhiProvider();
    await (bodhiProvider.provider as BodhiProvider).api.isReady;

    $provider = bodhiProvider;
    const bodhiSigner = new BodhiSigner(
      bodhiProvider.provider as BodhiProvider,
      "16X4Z3enBQjKsqMgf1BxpSu8cv2ZGNqFjKBgBUpZBWfWbP3D",
      talisman.signer as any
    );
    $signer = bodhiSigner;
    close();
  };
</script>

<div
  class="absolute top-0 left-0 flex justify-center items-center w-screen h-screen bg-black bg-opacity-50 z-20"
>
  <div class="p-2 rounded-xl bg-base-200 dark:bg-base-800">
    <div
      class="flex flex-col justify-center items-center gap-3 shadow-inner-input p-4 rounded-xl"
    >
      <div
        on:click={connectTalisman}
        class="flex justify-center items-center w-64 h-12 bg-white dark:bg-base-100 rounded-lg cursor-pointer"
      >
        <img src={TalismanLogo} alt="talisman" />
      </div>
      <div
        on:click={connectMetamask}
        class="flex justify-center items-center w-64 h-12 bg-white dark:bg-base-100 rounded-lg cursor-pointer"
      >
        <img src={MetamaskLogo} alt="metamask" />
      </div>
    </div>
  </div>
</div>
