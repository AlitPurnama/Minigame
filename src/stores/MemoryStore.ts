import { writable } from "svelte/store";
import type { CardType } from "../types";

const MemoryStore = writable<CardType[]>([])

export default MemoryStore

