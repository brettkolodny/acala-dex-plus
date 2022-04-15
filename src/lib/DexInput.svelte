<script lang="ts">
  import TokenSelect from "./TokenSelect.svelte";

  export let to: boolean = false;

  let inputValue = "";
  let max = to ? 100.4578 : null;

  const id = to ? "to-input" : "from-input";

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
  <TokenSelect
    allowMax={to}
    defaultTokenSymbol={to ? "aUSD" : "LKSM"}
    {setMax}
  />
</div>
