<script lang="ts">
  import { Contract, Signer } from "ethers";
  import erc20 from "../abis/ERC20.json";
  import { accountInfo } from "./stores/accountInfo";
  import type { Token } from "./tokens";
  import TokenSelect from "./TokenSelect.svelte";
  import { getBalanceOf } from "./web3";

  export let from: boolean = false;

  const id = from ? "to-input" : "from-input";

  let inputValue = "";
  let selectedToken: Token;
  let max = null;

  $: {
    if (from) {
      selectedToken = $accountInfo.fromToken;
    } else {
      selectedToken = $accountInfo.toToken;
    }
  }

  $: tokenContract = new Contract(
    selectedToken.address,
    erc20,
    $accountInfo.provider
  );

  $: {
    if (from && $accountInfo.signer) {
      getBalanceOf(tokenContract, $accountInfo).then((balance: number) => {
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
      } else {
        $accountInfo.fromToken = token;
      }
    } else {
      if (token == $accountInfo.fromToken) {
        const to = $accountInfo.toToken;
        $accountInfo.toToken = $accountInfo.fromToken;
        $accountInfo.fromToken = to;
      } else {
        $accountInfo.toToken = token;
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
