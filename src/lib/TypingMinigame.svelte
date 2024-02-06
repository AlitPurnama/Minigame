<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { words } from "../assets/words.json";
  import type { TypingWord } from "../types";

  let test: TypingWord[] = [];
  function GenerateWords(length: number) {
    test = [];
    for (let i = 0; i < length; i++) {
      const word = words[Math.floor(Math.random() * words.length)];
      test.push({ word: word, words: word.split("") });
    }
  }
  function KeyEvent(e: KeyboardEvent) {
    console.log(e.key);
  }

  onMount(async () => {
    GenerateWords(100);
    window.addEventListener("keypress", KeyEvent);
  });

  onDestroy(() => {
    window.removeEventListener("keypress", KeyEvent);
  });
</script>

<div class="typing-wrapper">
  <div>
    <div>
      <p class="text-2xl px-2 text-blue-300">30</p>
    </div>
    <div class="text-3xl w-[70vw] py-2 mt-2 rounded max-h-20 overflow-hidden">
      {#each test as { words }}
        <div class="word">
          {#each words as letter}
            <letter>{letter}</letter>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  .word {
    @apply w-fit mx-1 text-gray-500/90 select-none inline-block;
  }
  .typing-wrapper {
    @apply w-screen h-screen overflow-hidden;
    @apply relative grid place-items-center;
  }
</style>
