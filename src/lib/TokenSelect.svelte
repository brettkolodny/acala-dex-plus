<script lang="ts">
  import { getContext } from "svelte";
  import { tokens, Chain } from "./tokens";
  import TokenDropdown from "./TokenDropdown.svelte";

  // export let targetId: string;
  export let allowMax: boolean = false;
  export let defaultTokenSymbol = "KSM";
  export let setMax: () => void;

  let selectedToken = defaultTokenSymbol
    ? tokens.find((token) => token.symbol === defaultTokenSymbol)
    : tokens[0];
  let showMax = false;
  let showDropdown = false;

  const chain: Chain = getContext("chain");
  const activeTokens = tokens.filter((token) => {
    if (token.chains && token.chains.includes(chain)) {
      return true;
    }
  });
</script>

<div
  class="absolute flex flex-row justify-end w-full cursor-text pointer-events-none"
>
  <div
    class={`flex flex-row justify-end items-center gap-2 bg-base-800 mr-4 pointer-events-auto ${
      showMax ? "rounded-l-xl rounded-r-[22px]" : "rounded-full"
    } cursor-defaults`}
    on:mouseenter={() => {
      if (allowMax) {
        showMax = true;
      }
    }}
    on:mouseleave={() => {
      if (allowMax) {
        showMax = false;
      }
    }}
  >
    {#if showMax}
      <div
        on:click={(e) => {
          e.stopPropagation();
          setMax();
          showMax = false;
        }}
        class="flex justify-center items-center w-24 h-[34px] bg-primary-400 text-white font-semibold rounded-lg ml-1 cursor-pointer shadow-lg transition-all"
      >
        Max
      </div>
    {/if}

    <div
      on:click={() => {
        showDropdown = !showDropdown;
      }}
    >
      {#if selectedToken.img}
        <img
          src={selectedToken.img}
          class="h-[42px] w-[42px] bg-base-300 rounded-full shadow-lg flat-right cursor-pointer"
          alt={selectedToken.symbol}
        />
      {:else}
        <div
          class="h-[42px] w-[42px] bg-base-300 rounded-full shadow-lg flat-right cursor-pointer"
        />
      {/if}
    </div>
  </div>
  {#if showDropdown}
    <TokenDropdown
      tokens={activeTokens}
      {selectedToken}
      setSelected={(token) => {
        selectedToken = token;
        showDropdown = false;
      }}
      hideDropdown={() => (showDropdown = false)}
    />
  {/if}
</div>
