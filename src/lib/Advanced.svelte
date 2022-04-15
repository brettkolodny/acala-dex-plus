<script lang="ts">
  import { slide } from "svelte/transition";

  let slippage = 0.5;
  let customValue: string | null = null;

  const onCustomInput = (e: Event) => {
    const value = Number((e.target as HTMLInputElement).value);
    customValue = (e.target as HTMLInputElement).value;
    if (!value) {
      slippage = 0.5;
    } else {
      slippage = value;
    }
  };
</script>

<div
  transition:slide
  class="flex flex-col justify-evenly items-center w-full gap-4 bg-base-600 shadow-inner rounded-xl p-2"
>
  <div class="flex flex-row justify-between items-center w-full text-xl">
    <div class="text-base-200">Slippage</div>
    <div
      class={`flex justify-center items-center w-14 h-8 rounded-md text-white cursor-pointer transition-all ${
        slippage === 0.1 && !customValue
          ? "bg-primary-500 shadow-sm"
          : "bg-base-400 shadow-inner-input"
      }`}
      on:click={() => (slippage = 0.1)}
    >
      0.1%
    </div>
    <div
      class={`flex justify-center items-center w-14 h-8 rounded-md text-white cursor-pointer transition-all ${
        slippage === 0.5 && !customValue
          ? "bg-primary-500 shadow-sm"
          : "bg-base-400 shadow-inner-input"
      }`}
      on:click={() => (slippage = 0.5)}
    >
      0.5%
    </div>
    <div
      class={`flex justify-center items-center w-14 h-8 rounded-md text-white cursor-pointer transition-all ${
        slippage === 1 && !customValue
          ? "bg-primary-500 shadow-sm"
          : "bg-base-400 shadow-inner-input"
      }`}
      on:click={() => (slippage = 1)}
    >
      1.0%
    </div>
    <input
      on:input={onCustomInput}
      type="number"
      class={`w-20 rounded-md bg-base-200 text-center h-8`}
      placeholder="custom"
    />
  </div>
  <div class="w-full h-[2px] bg-base-500 shadow-inner" />
  <div
    class="flex flex-row justify-between items-center w-full text-xl text-base-200 "
  >
    <div>Trading Fee</div>
    <div class="text-white font-normal">0.34 KAR</div>
  </div>
  <div
    class="flex flex-row justify-between items-center w-full text-xl text-base-200 "
  >
    <div>Gas Est.</div>
    <div class="text-white font-normal">0.0022 KAR</div>
  </div>
  <div
    class="flex flex-row justify-between items-center w-full text-xl text-base-200 "
  >
    <div>Price Impact</div>
    <div class="text-white font-normal">0.4%</div>
  </div>
</div>

<style>
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
