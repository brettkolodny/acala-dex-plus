<script lang="ts">
  import DexInput from "./DexInput.svelte";
  import Advanced from "./Advanced.svelte";
  import cogIcon from "../assets/icons/cog.svg";

  let showAdvanced = false;
</script>

<div
  class={`flex flex-col justify-center items-center gap-2 w-[448px] p-2 bg-base-800 rounded-xl shadow-xl transition-height`}
>
  <DexInput to />
  <DexInput />
  <div class="flex flex-row justify-between items-center w-full">
    <div class="text-base-300">
      1 aUSD = 0.0559 LKSM
    </div>
    <div
      on:click={() => (showAdvanced = !showAdvanced)}
      class="p-1 rounded-full hover:bg-gray-500 cursor-pointer"
    >
      <img src={cogIcon} alt="advanced" />
    </div>
  </div>
  {#if showAdvanced}
    <Advanced />
  {/if}
  <div
    class="flex justify-center items-center w-full h-16 text-white text-2xl font-semibold rounded-xl bg-primary-900 cursor-pointer hover:bg-primary-800 transition-all"
  >
    Swap
  </div>
</div>
