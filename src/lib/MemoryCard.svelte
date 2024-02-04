<script lang="ts">
  import { onMount } from "svelte";
  import MemoryStore from "../stores/MemoryStore";
  import type { CardType } from "../types";
  import { flip } from "svelte/animate";
  import { quadInOut } from "svelte/easing";

  let SymbolList = [
    // Arch
    " 󰣇 ",
    // Gamepad
    " 󰮂 ",
    // Krita
    "  ",
    // Linux
    "  ",
    // Gentoo
    "  ",
    // Garuda
    "  ",
    // Fedora
    "  ",
    // Neovim
    "  ",
    // PopOS
    "  ",
    // Hyprland
    "  ",
    // KDE
    "  ",
    // Sway
    "  ",
    // Gnome
    "  ",
    // Xfce
    "  ",
  ];

  function ClickCard(id: string) {
    let Data = $MemoryStore.find((x) => x.id === id);
    if (!Data) return;
    Data.flipped = !Data.flipped;
    MemoryStore.update((x) => {
      let data = x.find((y) => y.id === id);
      if (data) {
        data = Data;
      }
      return x;
    });
  }

  function ShuffleArray(array: Array<CardType>) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  function GenerateID() {
    return Math.random()
      .toString(36)
      .substring(2, 5 + 2);
  }

  function GetEmoji() {
    return SymbolList[Math.floor(Math.random() * SymbolList.length)];
  }

  function GenerateData() {
    MemoryStore.set([]);
    let emojis: String[] = [];
    for (let i = 0; i < 8; i++) {
      let emoji: string = GetEmoji();
      while (emojis.find((x) => x === emoji) !== undefined) {
        emoji = GetEmoji();
      }
      emojis.push(emoji);
      MemoryStore.update((x) => {
        return [
          { id: GenerateID(), flipped: false, matched: false, emoji: emoji },
          { id: GenerateID(), flipped: false, matched: false, emoji: emoji },
          ...x,
        ];
      });
    }
    setTimeout(() => {
      MemoryStore.set(ShuffleArray($MemoryStore));
    }, 3000);
  }
  onMount(GenerateData);
</script>

<div class="memory-card-wrapper">
  <div>
    <h1 class="text-4xl text-center">Memory Card</h1>
    <div class="grid place-items-center">
      <div
        class="border border-blue-200 rounded mt-5 p-2 grid grid-cols-4 gap-2 w-fit"
      >
        {#each $MemoryStore as { id, emoji, matched, flipped } (id)}
          <button
            class="card"
            animate:flip={{ duration: 400, easing: quadInOut }}
            class:flipped
            on:click={() => {
              ClickCard(id);
            }}
            >{flipped || matched ? emoji : "?"}
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .card.flipped {
    @apply font-nerdsymbol;
  }
  .card {
    @apply bg-blue-200 text-gray-900 transition-all ease-in-out;
    @apply lg:w-32 lg:h-32 md:h-24 md:w-24 grid place-items-center text-4xl;
  }
  .memory-card-wrapper {
    @apply w-screen h-screen grid place-items-center;
  }
</style>
