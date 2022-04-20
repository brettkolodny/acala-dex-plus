<script lang="ts">
  import { fly } from "svelte/transition";
  import successIcon from "../assets/icons/success.svg";
  import errorIcon from "../assets/icons/error.svg";

  export let type: "error" | "success";
  export let title: string;
  export let details: string | null = null;
</script>

<div
  transition:fly|local
  class="absolute top-20 right-4 flex flex-row justify-start items-center min-w-[320px] h-20 rounded-xl bg-base-200 overflow-hidden z-10"
>
  <div
    class={`w-3 h-full ${type === "error" ? "bg-red-400" : "bg-green-500"}`}
  />
  <div class="flex flex-row justify-between w-full px-6">
    <div class="flex flex-col justify-center items-start">
      <div class="text-2xl text-base-900 font-semibold">{title}</div>
      {#if details}
        <div class="text-base-900 font-normal">{details}</div>
      {/if}
    </div>
    <img
      class=" w-14"
      src={type === "success" ? successIcon : errorIcon}
      alt={type}
    />
  </div>
</div>
