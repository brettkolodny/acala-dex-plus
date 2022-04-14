<script lang="ts">
  import type { Token } from "./tokens";
  import { clickOutside } from "./directives/clickOutside";

  export let tokens: Token[];
  export let selectedToken: Token;
  export let setSelected: (token: Token) => void;
  export let setShow: (show: boolean) => void;
</script>

<div
  class="absolute flex flex-col justify-center items-start bg-base-300 p-1 rounded-xl shadow-xl z-10 transform translate-y-12 translate-x-10 pointer-events-auto"
  use:clickOutside
  on:outclick={() => setShow(false)}
>
  {#each tokens as token}
    <div
      class={`flex flex-row justify-start items-center gap-1 w-full cursor-pointer rounded-lg p-1 ${
        token.symbol === selectedToken.symbol ? "bg-base-600 shadow-inner" : ""
      }`}
      on:click={() => setSelected(token)}
    >
      <div class="rounded-full bg-base-800">
        {#if token.img}
          <img src={token.img} alt={token.symbol} class="w-5 h-5" />
        {:else}
          <div class="w-5 h-5 rounded-full bg-base-200" />
        {/if}
      </div>
      <div
        class={`${token.symbol === selectedToken.symbol ? "text-white" : ""}`}
      >
        {token.symbol}
      </div>
    </div>
  {/each}
</div>
