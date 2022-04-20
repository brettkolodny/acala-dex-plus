<script lang="ts">
  import { getContext } from "svelte";
  import { Chain } from "./tokens";
  import { accountInfo } from "./stores/accountInfo";
  import { FixedPointNumber } from "@acala-network/sdk-core";

  const chain = getContext("chain");
  const nativeSymbol =
    chain === Chain.ACALA || chain === Chain.MANDALA ? "ACA" : "KAR";

  let address = null;
  let balance = null;

  $: {
    const getAccountInfo = async () => {
      const accounts: string[] = await $accountInfo.provider.send(
        "eth_requestAccounts",
        []
      );
      address = `${accounts[0].slice(0, 6)}...${accounts[0].slice(
        accounts[0].length - 4
      )}`;

      balance = new FixedPointNumber(
        (await $accountInfo.provider.getBalance(accounts[0])).toString(),
        4
      )
        .div(new FixedPointNumber(10 ** 18))
        .toString();
    };

    if ($accountInfo.signer) {
      getAccountInfo();
    }
  }
</script>

{#if address}
  <div
    class="absolute top-4 right-4 flex flex-row justify-center items-center h-10 bg-white dark:bg-base-200 rounded-xl px-1"
  >
    {#if balance != null}
      <div class=" text-lg font-medium px-4">{balance} {nativeSymbol}</div>
    {/if}
    <div
      class="flex justify-center items-center w-40 h-8 bg-base-50 dark:bg-base-500 rounded-xl text-xl dark:text-white shadow-inner-input"
    >
      {address}
    </div>
  </div>
{/if}
