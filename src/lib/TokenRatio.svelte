<script lang="ts">
  import { fromToken, toToken, ratio } from "./directives/stores";

  const getRatioDisplay = (r: string | null) => {
    if (r) {
      const [whole, decimal] = r.split(".");
      return `${whole || 0}.${
        decimal.length > 4 ? decimal.slice(0, 4) : decimal
      }`;
    }

    return null;
  };

  $: ratioDisplay = getRatioDisplay($ratio);
  $: fromTokenSymbol = $fromToken.symbol;
  $: toTokenSymbol = $toToken.symbol;
</script>

<div>
  {#if ratioDisplay}
    <div class="text-base-800 dark:text-base-300">
      1 {fromTokenSymbol} ≈ {ratioDisplay}
      {toTokenSymbol}
    </div>
  {/if}
</div>
