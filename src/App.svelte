<script lang="ts">
  import MemoryCard from "./lib/MemoryCard.svelte";
  import { ChevronRight } from "lucide-svelte";
  import Navigation from "./lib/Navigation.svelte";
  import TypingMinigame from "./lib/TypingMinigame.svelte";
</script>

<main
  class="h-screen w-screen bg-gray-800 text-white font-bebas tracking-wide overflow-hidden"
>
  <Navigation />
  <TypingMinigame />
</main>
