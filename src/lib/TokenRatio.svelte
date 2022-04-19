<script lang="ts">
  import { accountInfo } from "./stores/accountInfo";
  import type { Token } from "./tokens";

  let ratio = null;

  $: ratio = $accountInfo.ratio;
  $: fromTokenSymbol = $accountInfo.fromToken.symbol;
  $: toTokenSymbol = $accountInfo.toToken.symbol;
  $: {
    fromTokenSymbol;
    toTokenSymbol;

    ratio = null;
  }

  const getRatio = async (fromToken: Token, toToken: Token) => {
    const decimals = await $accountInfo.fromTokenContract.decimals();
    const oneToken = 1 * 10 ** decimals;

    const amount = await $accountInfo.dexContract.getSwapTargetAmount(
      [fromToken.address, toToken.address],
      oneToken
    );

    const [whole, decimal] = (amount.toNumber() / 10 ** 12)
      .toString()
      .split(".");

    $accountInfo.ratio = `${whole || 0}.${
      decimal.length > 4 ? decimal.slice(0, 4) : decimal
    }`;
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
