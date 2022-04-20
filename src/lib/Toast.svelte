<script lang="ts">
  import { slide } from "svelte/transition";

  export let type: "error" | "success";
  export let title: string;
  export let details: string | null = null;
</script>

<div
  transition:slide|local
  class="absolute top-8 right-8 flex flex-row justify-start items-center w-80 h-24 rounded-xl bg-base-200 overflow-hidden z-10"
>
  <div
    class={`w-4 h-full ${type === "error" ? "bg-red-400" : "bg-green-500"}`}
  />
  <div class="flex flex-col justify-center items-start">
    <div class="text-2xl text-base-900 font-semibold">{title}</div>
    {#if details}
      <div class="text-base-900 font-normal">{details}</div>
    {/if}
  </div>
</div>
