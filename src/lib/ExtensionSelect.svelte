<script lang="ts">
  import { provider, signer } from "./stores";
  import MetamaskLogo from "../assets/icons/Metamask.svg";
  import TalismanLogo from "../assets/icons/Talisman.svg";
  import MultiProvider from "./MultiProvider";
  import type { providers } from "ethers";

  export let close: () => void;

  const connectMetamask = async () => {
    $provider = MultiProvider.createEthProvider();
    const ethProvider = $provider!.provider as providers.Web3Provider;
    await ethProvider.send("eth_requestAccounts", []);
    $signer = ethProvider.getSigner();
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
