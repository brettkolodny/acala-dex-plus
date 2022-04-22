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
</script>

<div>
  {#if ratio}
    <div class="text-base-800 dark:text-base-300">
      1 {fromTokenSymbol} ≈ {ratio}
      {toTokenSymbol}
    </div>
  {/if}
</div>
