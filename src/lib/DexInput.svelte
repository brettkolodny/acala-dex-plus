<script lang="ts">
  import { FixedPointNumber } from "@acala-network/sdk-core";
  import { accountInfo } from "./stores/accountInfo";
  import type { Token } from "./tokens";
  import TokenSelect from "./TokenSelect.svelte";
  import { getBalanceOf } from "./web3";

  export let from: boolean = false;

  const id = from ? "from-input" : "to-input";

  let selectedToken: Token;
  let max = null;
  let inputElement: HTMLInputElement;

  const setRatio = async (fromToken: Token, toToken: Token) => {
    const decimals = await $accountInfo.fromTokenContract.decimals();
    const oneToken = FixedPointNumber.ONE.mul(
      new FixedPointNumber(10 ** decimals)
    );

    const amount = new FixedPointNumber(
      (
        await $accountInfo.dexContract.getSwapTargetAmount(
          [fromToken.address, toToken.address],
          oneToken.toString()
        )
      ).toString()
    );

    const targetTokenDecimals = await $accountInfo.toTokenContract.decimals();

    $accountInfo.ratio = amount
      .div(new FixedPointNumber(10 ** targetTokenDecimals))
      .toString();
  };

  setRatio($accountInfo.fromToken, $accountInfo.toToken);

  $: inputValue = from
    ? $accountInfo.fromTokenAmount
    : $accountInfo.toTokenAmount;

  $: {
    if (inputElement) {
      if (from) {
        inputElement.value = $accountInfo.fromTokenAmount;
      } else {
        inputElement.value = $accountInfo.toTokenAmount;
      }
    }
  }

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

  const setInputValues = (inputElement: HTMLInputElement) => {
    if (!isNaN(Number(inputElement.value))) {
      if (from) {
        $accountInfo.fromTokenAmount = inputElement.value;

        const newAmount = new FixedPointNumber(
          $accountInfo.fromTokenAmount
        ).mul(new FixedPointNumber($accountInfo.ratio));
        $accountInfo.toTokenAmount =
          !newAmount.isNaN() && !newAmount.isZero() ? newAmount.toString() : "";

        let toInput = document.getElementById("to-input") as HTMLInputElement;
        toInput.value = $accountInfo.toTokenAmount || "";
      } else {
        $accountInfo.toTokenAmount = inputElement.value;

        const newAmount = new FixedPointNumber($accountInfo.toTokenAmount).div(
          new FixedPointNumber($accountInfo.ratio)
        );
        $accountInfo.fromTokenAmount =
          !newAmount.isNaN() && !newAmount.isZero() ? newAmount.toString() : "";

        let toInput = document.getElementById("from-input") as HTMLInputElement;
        toInput.value = $accountInfo.fromTokenAmount;
      }
    } else {
      inputElement.value = from
        ? $accountInfo.fromTokenAmount
        : $accountInfo.toTokenAmount;
    }
  };

  const inputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setInputValues(target);
  };

  const setMax = () => {
    if (max) {
      const input = document.getElementById(id) as HTMLInputElement;
      const maxString = max.toString();
      input.value = maxString;
      setInputValues(input);
    }
  };

  const setSelectedToken = async (token: Token) => {
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

    await setRatio($accountInfo.fromToken, $accountInfo.toToken);
    setInputValues(inputElement);
  };
</script>

<div
  class="relative flex flex-row justify-between items-center w-full h-20 bg-base-100 dark:bg-base-600 rounded-xl shadow-inner-input"
>
  <div
    class="flex flex-row justify-start items-center w-full h-full pl-4 bg-transparent rounded-xl dark:text-white text-3xl overflow-hidden"
  >
    {#if inputValue && inputValue.length < 12}
      <span
        class={`${max && Number(inputValue) > max ? "text-primary-500" : ""}`}
        >{from
          ? $accountInfo.fromTokenAmount
          : $accountInfo.toTokenAmount}</span
      >
    {:else if inputValue}
      <div />
    {:else}
      <span class="text-base-500">0.0</span>
    {/if}
    {#if max != null && Number(inputValue) != max && inputValue.length < 12}
      <span class="text-base-500">&nbsp;/&nbsp;{max}</span>
    {/if}
  </div>
  <input
    bind:this={inputElement}
    {id}
    class={`absolute w-full h-full pl-4 bg-transparent rounded-xl dark:text-white text-3xl ${
      max && Number(inputValue) > max
        ? "text-red-400 dark:text-primary-200"
        : ""
    }`}
    on:input={inputChange}
  />
  <TokenSelect allowMax={from} {selectedToken} {setMax} {setSelectedToken} />
</div>
