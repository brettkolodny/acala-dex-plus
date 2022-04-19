<script lang="ts">
  import { accountInfo } from "./stores/accountInfo";
  import type { Token } from "./tokens";
  import TokenSelect from "./TokenSelect.svelte";
  import { getBalanceOf } from "./web3";

  export let from: boolean = false;

  export let inputValue = "";

  const id = from ? "to-input" : "from-input";

  let selectedToken: Token;
  let max = null;

  $: {
    if (from) {
      selectedToken = $accountInfo.fromToken;
    } else {
      selectedToken = $accountInfo.toToken;
    }
  }

  $: {
    if (from && $accountInfo.signer) {
      getBalanceOf(
        from ? $accountInfo.fromTokenContract : $accountInfo.toTokenContract,
        $accountInfo
      ).then((balance: number) => {
        max = balance;
      });
    }
  }

  const inputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;

    if (!isNaN(Number(target.value))) {
      inputValue = target.value;
    } else {
      target.value = inputValue;
    }
  };

  const setMax = () => {
    const input = document.getElementById(id) as HTMLInputElement;
    const maxString = max.toString();
    inputValue = maxString;
    input.value = maxString;
  };

  const setSelectedToken = (token: Token) => {
    if (from) {
      if (token == $accountInfo.toToken) {
        const from = $accountInfo.fromToken;
        $accountInfo.fromToken = $accountInfo.toToken;
        $accountInfo.toToken = from;

        const fromContract = $accountInfo.fromTokenContract;
        $accountInfo.fromTokenContract = $accountInfo.toTokenContract;
        $accountInfo.toTokenContract = fromContract;
      } else {
        $accountInfo.fromToken = token;
        $accountInfo.updateContract(true);
      }
    } else {
      if (token == $accountInfo.fromToken) {
        const to = $accountInfo.toToken;
        $accountInfo.toToken = $accountInfo.fromToken;
        $accountInfo.fromToken = to;

        const fromContract = $accountInfo.fromTokenContract;
        $accountInfo.fromTokenContract = $accountInfo.toTokenContract;
        $accountInfo.toTokenContract = fromContract;
      } else {
        $accountInfo.toToken = token;
        $accountInfo.updateContract(false);
      }
    }
  };
</script>

<div
  class="relative flex flex-row justify-between items-center w-full h-20 bg-base-600 rounded-xl shadow-inner-input"
>
  <div
    class="flex flex-row justify-start items-center w-full h-full pl-4 bg-transparent rounded-xl text-white text-3xl"
  >
    {#if inputValue}
      <span
        class={`${max && Number(inputValue) > max ? "text-primary-500" : ""}`}
        >{inputValue}</span
      >
    {:else}
      <span class="text-base-500">0.0</span>
    {/if}
    {#if max != null && Number(inputValue) != max}
      <span class="text-base-500">&nbsp;/&nbsp;{max}</span>
    {/if}
  </div>
  <input
    {id}
    class={`absolute w-full h-full pl-4 bg-transparent rounded-xl text-white text-3xl ${
      max && Number(inputValue) > max ? "text-primary-200" : ""
    }`}
    on:input={inputChange}
  />
  <TokenSelect allowMax={from} {selectedToken} {setMax} {setSelectedToken} />
</div>
