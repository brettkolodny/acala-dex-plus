<script lang="ts">
  import { FixedPointNumber } from "@acala-network/sdk-core";
  import {
    dexContract,
    fromToken,
    fromTokenAmount,
    fromTokenContract,
    ratio,
    toToken,
    toTokenAmount,
    toTokenContract,
    stableToken,
    signer,
    provider,
  } from "./stores";
  import type { Token } from "./tokens";
  import TokenSelect from "./TokenSelect.svelte";
  import { getBalanceOf } from "./Web3.svelte";

  export let from: boolean = false;

  const id = from ? "from-input" : "to-input";

  let selectedToken: Token;
  let max: number | null = null;
  let inputElement: HTMLInputElement;

  $: console.log($provider);

  const setRatio = async (fromToken: Token, toToken: Token) => {
    if ($provider) {
      const decimals = await $fromTokenContract!.decimals();
      const oneToken = FixedPointNumber.ONE.mul(
        new FixedPointNumber(10 ** decimals)
      );

      let amount: FixedPointNumber;
      try {
        amount = new FixedPointNumber(
          (
            await $dexContract!.getSwapTargetAmount(
              [fromToken.address, toToken.address],
              oneToken.toString()
            )
          ).toString()
        );
      } catch {
        amount = new FixedPointNumber(
          (
            await $dexContract!.getSwapTargetAmount(
              [fromToken.address, $stableToken.address, toToken.address],
              oneToken.toString()
            )
          ).toString()
        );
      }

      const targetTokenDecimals = await $toTokenContract!.decimals();

      $ratio = amount
        .div(new FixedPointNumber(10 ** targetTokenDecimals))
        .toString();
    }
  };

  $: inputValue = from ? $fromTokenAmount : $toTokenAmount;

  $: {
    if (inputElement) {
      if (from) {
        inputElement.value = $fromTokenAmount;
      } else {
        inputElement.value = $toTokenAmount;
      }
    }
  }

  $: {
    if (from) {
      selectedToken = $fromToken;
    } else {
      selectedToken = $toToken;
    }
  }

  $: {
    if (from && $signer) {
      getBalanceOf(
        from ? $fromTokenContract! : $toTokenContract!,
        $signer
      ).then((balance: number) => {
        max = balance;
      });
    }
  }

  $: {
    if ($provider) {
      setRatio($fromToken, $toToken);
    }
  }

  const setInputValues = (inputElement: HTMLInputElement) => {
    if (!isNaN(Number(inputElement.value))) {
      if (from) {
        $fromTokenAmount = inputElement.value;

        if ($provider) {
          const newAmount = new FixedPointNumber($fromTokenAmount).mul(
            new FixedPointNumber($ratio ? $ratio : "0")
          );
          $toTokenAmount =
            !newAmount.isNaN() && !newAmount.isZero()
              ? newAmount.toString()
              : "";

          let toInput = document.getElementById("to-input") as HTMLInputElement;
          toInput.value = $toTokenAmount || "";
        }
      } else {
        $toTokenAmount = inputElement.value;

        if ($provider) {
          const newAmount = new FixedPointNumber($toTokenAmount).div(
            new FixedPointNumber($ratio ? $ratio : "0")
          );
          $fromTokenAmount =
            !newAmount.isNaN() && !newAmount.isZero()
              ? newAmount.toString()
              : "";

          let toInput = document.getElementById(
            "from-input"
          ) as HTMLInputElement;
          toInput.value = $fromTokenAmount;
        }
      }
    } else {
      inputElement.value = from ? $fromTokenAmount : $toTokenAmount;
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
      if (token == $toToken) {
        const from = $fromToken;
        $fromToken = $toToken;
        $toToken = from;
      } else {
        $fromToken = token;
      }
    } else {
      if (token == $fromToken) {
        const to = $toToken;
        $toToken = $fromToken;
        $fromToken = to;
      } else {
        $toToken = token;
      }
    }

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
        >{from ? $fromTokenAmount : $toTokenAmount}</span
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
