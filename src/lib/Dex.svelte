<script lang="ts">
  import TokenSelect from "./TokenSelect.svelte";
  import DexInput from "./DexInput.svelte";
</script>

<div
  class={`flex flex-col justify-center items-center gap-2 w-[448px] p-2 bg-base-800 rounded-xl shadow-xl`}
>
  <DexInput to />
  <DexInput />
  <div
    class="flex justify-center items-center w-full h-16 text-white text-2xl font-semibold rounded-xl bg-primary-900 cursor-pointer hover:bg-primary-800"
  >
    Swap
  </div>
</div>
