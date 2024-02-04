<script>
  import { ChevronRight } from "lucide-svelte";
</script>

<div class="settings">
  <button
    class="square-10 grid place-items-center rounded-full transform transition-transform hover:translate-x-1"
  >
    <ChevronRight class="text-xl" />
  </button>
</div>

<style lang="postcss">
  .settings {
    @apply absolute left-0 bottom-1/2 transform -translate-y-1/2;
  }
</style>
