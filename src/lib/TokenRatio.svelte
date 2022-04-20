<script lang="ts">
  import { FixedPointNumber } from "@acala-network/sdk-core";
  import { accountInfo } from "./stores/accountInfo";
  import type { Token } from "./tokens";

  let ratio = null;

  const getRatioDisplay = (r: string | null) => {
    if (r) {
      const [whole, decimal] = r.split(".");
      return `${whole || 0}.${
        decimal.length > 4 ? decimal.slice(0, 4) : decimal
      }`;
    }

    return null;
  };

  $: ratio = getRatioDisplay($accountInfo.ratio);
  $: fromTokenSymbol = $accountInfo.fromToken.symbol;
  $: toTokenSymbol = $accountInfo.toToken.symbol;
  $: {
    fromTokenSymbol;
    toTokenSymbol;

    ratio = null;
  }

  const getRatio = async (fromToken: Token, toToken: Token) => {
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

  $: getRatio($accountInfo.fromToken, $accountInfo.toToken);
</script>

<div>
  {#if ratio}
    <div class="text-base-300">
      1 {fromTokenSymbol} = {ratio}
      {toTokenSymbol}
    </div>
  {/if}
</div>
