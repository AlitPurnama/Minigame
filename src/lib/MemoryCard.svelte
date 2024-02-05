<script lang="ts">
  import { onMount } from "svelte";
  import MemoryStore from "../stores/MemoryStore";
  import type { CardType } from "../types";
  import { flip } from "svelte/animate";
  import { quadInOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  let OpenCard1: CardType | null = null;
  let OpenCard2: CardType | null = null;

  // NOTE: Use nerd font so you can see the symbol below
  let SymbolList = [
    // Arch
    " 󰣇 ",
    // Krita
    "  ",
    // Linux
    "  ",
    // Ubuntu
    "  ",
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
    // Rust
    "  ",
    // Typescript
    " 󰛦 ",
    // Javscript
    " 󰌞 ",
  ];

  // TODO: Rework DoFlip and ResetFlip function must be the stupidiest thing I've ever done
  function DoFlip(id: string) {
    if ((OpenCard1 && OpenCard2) !== null) return;
    if (!OpenCard1) {
      console.log("DOFLIP");
      OpenCard1 = $MemoryStore.find((x) => x.id === id)!;
      return;
    } else if (!OpenCard2) {
      OpenCard2 = $MemoryStore.find((x) => x.id === id)!;
      return;
    }
  }

  function ResetFlip(id: string) {
    if (OpenCard1 && OpenCard1.id === id) {
      OpenCard1 = null;
    } else if (OpenCard2 && OpenCard2.id === id) {
      OpenCard2 = null;
    }
  }

  function ClickCard(id: string) {
    if (OpenCard1 && OpenCard2) return;
    let Data = $MemoryStore.find((x) => x.id === id);
    if (!Data) return;
    if (Data.matched) return;
    Data.flipped = !Data.flipped;
    if (Data.flipped) {
      DoFlip(id);
    } else {
      ResetFlip(id);
    }
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

  // NOTE: Doesn't guarantee to be random (might be duplicated)
  function GenerateID() {
    return Math.random()
      .toString(36)
      .substring(2, 5 + 2);
  }

  function GetEmoji() {
    return SymbolList[Math.floor(Math.random() * SymbolList.length)];
  }

  function CheckIsMatch() {
    if (!(OpenCard1 && OpenCard2)) return;
    if (OpenCard1.emoji === OpenCard2.emoji) {
      MemoryStore.update((x) => {
        let card1 = $MemoryStore.find((y) => y.id === OpenCard1?.id);
        let card2 = $MemoryStore.find((y) => y.id === OpenCard2?.id);
        if (card1 && card2) {
          card1.matched = true;
          card2.matched = true;
          ResetFlip(card1.id);
          ResetFlip(card2.id);
        }
        return x;
      });
    } else {
      setTimeout(() => {
        MemoryStore.update((y) => {
          let filtered = y.filter((x) => x.flipped);
          filtered.forEach((x) => {
            ResetFlip(x.id);
            ResetFlip(x.id);
            x.flipped = false;
          });
          return y;
        });
      }, 500);
    }
  }

  function IsAllMatch() {
    const MatchedData = $MemoryStore.filter((x) => x.matched);
    if (MatchedData.length !== $MemoryStore.length) return;
    return true;
  }

  function GenerateData() {
    MemoryStore.set([]);
    let emojis: String[] = [];
    for (let i = 0; i < 8; i++) {
      let emoji: string = GetEmoji();
      // Just make sure the emoji doesn't get duplicated
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
    MemoryStore.set(ShuffleArray($MemoryStore));
  }
  onMount(GenerateData);
  $: [OpenCard1, OpenCard2], CheckIsMatch();
  $: $MemoryStore, IsAllMatch();
</script>

<pre>
  {JSON.stringify(OpenCard1)}
  {JSON.stringify(OpenCard2)}
</pre>
<div class="memory-card-wrapper">
  <div class="relative grid place-items-center overflow-hidden">
    <div
      class="border border-blue-200 rounded mt-5 p-2 grid grid-cols-4 gap-2 w-fit"
    >
      {#each $MemoryStore as { id, emoji, matched, flipped } (id)}
        <button
          class="card"
          animate:flip={{ duration: 400, easing: quadInOut }}
          class:flipped={flipped || matched}
          on:click={() => {
            ClickCard(id);
          }}
        >
          <div class="back">
            {emoji}
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  .card > div {
    backface-visibility: hidden;
    position: absolute;
    @apply w-full h-full flex justify-center items-center;
  }
  .card > .back {
    transform: rotateY(180deg);
    @apply bg-blue-300 font-nerdsymbol;
  }
  .card.flipped {
    @apply font-nerdsymbol;
  }
  .card {
    @apply bg-blue-200 text-gray-900 transition-all ease-in-out;
    @apply lg:w-32 lg:h-32 md:h-24 md:w-24 grid place-items-center text-4xl;
    @apply relative duration-700;
    transform-style: preserve-3d;
  }
  .card.flipped {
    transform: rotateY(180deg);
  }
  .memory-card-wrapper {
    @apply w-screen h-screen grid place-items-center;
  }
</style>
