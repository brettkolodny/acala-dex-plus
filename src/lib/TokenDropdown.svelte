<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { clickOutside } from "./directives/clickOutside";
  import type { Token } from "./tokens";

  export let tokens: Token[];
  export let selectedToken: Token;
  export let setSelected: (token: Token) => void;
  export let hideDropdown: () => void;

  let show = false;

  const dispatch = createEventDispatcher();
</script>

<div
  transition:slide
  class="absolute flex flex-col justify-center items-start gap-1 bg-base-300 p-1 rounded-xl shadow-xl z-10 transform translate-y-12 translate-x-10 pointer-events-auto"
  use:clickOutside
  on:outclick={hideDropdown}
>
  {#each tokens as token}
    <div
      class={`flex flex-row justify-start items-center gap-2 w-full cursor-pointer rounded-lg p-1 ${
        token.symbol === selectedToken.symbol ? "bg-base-600 shadow-inner" : ""
      }`}
      on:click={() => {
        setSelected(token);
        hideDropdown();
      }}
    >
      <div class="rounded-full bg-base-800">
        {#if token.img}
          <img src={token.img} alt={token.symbol} class="w-8 h-8" />
        {:else}
          <div class="w-8 h-8 rounded-full bg-base-200" />
        {/if}
      </div>
      <div
        class={`text-lg ${
          token.symbol === selectedToken.symbol ? "text-white" : ""
        }`}
      >
        {token.symbol}
      </div>
    </div>
  {/each}
</div>
