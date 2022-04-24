<script lang="ts">
  import TalismanIcon from "../../assets/icons/talisman-icon.svg";
  import PolkadotjsIcon from "../../assets/icons/polkadot-js-icon.svg";

  export let accounts: Array<{ name?: string; address: string }>;
  export let createBodhiSigner: (address: string) => void;
  export let isTalisman = true;

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 8)}...${address.slice(address.length - 8)}`;
  };
</script>

{#each accounts as account}
  <div
    on:click={() => createBodhiSigner(account.address)}
    class="flex flex-row justify-start items-center gap-2 w-full min-w-[256px] h-16 pl-4 bg-white dark:bg-base-100 rounded-lg cursor-pointer"
  >
    {#if isTalisman}
      <img class="w-10" src={TalismanIcon} alt="talisman account" />
    {:else}
      <img class="w-10" src={PolkadotjsIcon} alt="polkadot-js account" />
    {/if}
    <div class="flex flex-col justify-center items-start">
      <div class="text-xl font-semibold">{account.name}</div>
      <div class="text-sm text-base-600">
        {formatAddress(account.address)}
      </div>
    </div>
  </div>
{/each}
