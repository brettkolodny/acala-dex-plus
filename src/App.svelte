<script lang="ts">
  import { setContext } from "svelte";
  import { Chain } from "./lib/tokens";
  import Dex from "./lib/Dex.svelte";

  setContext("chain", Chain.KARURA);
</script>

<main
  class="flex flex-col justify-start items-center h-screen w-screen bg-gradient-to-br from-primary-700 to-base-900 pt-80"
>
  <Dex />
</main>
