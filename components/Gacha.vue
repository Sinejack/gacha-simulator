<template>
  <div class="p-6 bg-orange-100">
    <h1 class="text-3xl font-bold underline mb-6">Gacha Simulator</h1>

    <div id="descriptionParagraph">
      <p>
        This gacha simulates Hoyoverse gacha games (Genshin Impact, Star Rail,
        etc)
      </p>
      <ul class="list-disc ml-8">
        <li>
          Drop rates are adjusted to 95%, 4% and 1% for
          <span class="text-blue-400">Common</span>
          ,
          <span class="text-purple-400">Rare</span>
          and
          <span class="text-amber-400">Epic</span>
          respectively. Use 94.3%, 5.1% and 0.6% if you wish to simulate
          official gacha rate.
        </li>
      </ul>
    </div>

    <div class="mt-4">
      <button
        type="button"
        @click="rollCount(1)"
        class="bg-blue-400 hover:bg-blue-600 text-white py-2 px-4 rounded">
        1x roll
      </button>
      <button
        type="button"
        @click="rollCount(10)"
        class="bg-blue-400 hover:bg-blue-600 text-white py-2 px-4 rounded ml-3">
        10x roll
      </button>
    </div>
    <div class="mt-4">
      <button
        type="button"
        @click="openItemsModal"
        class="bg-blue-400 hover:bg-blue-600 text-white py-2 px-4 rounded">
        View items
      </button>

      <button
        type="button"
        @click="openHistoryModal"
        class="bg-blue-400 hover:bg-blue-600 text-white py-2 px-4 rounded ml-3">
        View history
      </button>
    </div>

    <!-- Displays roll result (from left to right) -->
    <div v-if="rolledItems.length > 0" class="mt-4">
      <p class="mb-2">You received:</p>
      <table class="w-3/5 table-auto border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td
              v-for="(item, index) in rolledItems"
              :key="index"
              class="border border-gray-300 px-4 py-2"
              :class="rarityClass(item.rarity)">
              {{ item.name }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Items modal -->
    <RollItemsModal
      :isVisible="isItemsModalVisible"
      :items="items"
      @close="closeItemsModal" />

    <!-- History modal -->
    <RollHistoryModal
      :isVisible="isHistoryModalVisible"
      :history="rollHistory"
      @close="closeHistoryModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RollItemsModal from "./RollItemsModal.vue";
import RollHistoryModal from "./RollHistoryModal.vue";

// Interfaces for types (similar to objects in JS, classes in C#)
type Rarities = "C" | "R" | "E";

interface Item {
  name: string;
  tag: string[];
  isRatedUp?: boolean;
}

interface RollResult {
  rarity: "C" | "R" | "E";
  name: string;
  timestamp?: number;
}

interface ItemsPool {
  probability: number;
  items: Item[];
}

interface HistoryEntry {
  rarity: "C" | "R" | "E";
  name: string;
  timestamp: number;
}

// Variables
const rolledItems = ref<RollResult[]>([]);
const rollHistory = ref<HistoryEntry[]>([]);
const isItemsModalVisible = ref(false);
const isHistoryModalVisible = ref(false);
const isNextEpicRatedUp = ref(false);
const pityCounter = ref({ rare: 0, epic: 0 });

// The loot pool
const items: Record<Rarities, ItemsPool> = {
  C: {
    probability: 0.94,
    items: [
      { name: "Onion", tag: ["vegetable"] },
      { name: "Potato", tag: ["vegetable"] },
      { name: "Mushroom", tag: ["vegetable"] },
      { name: "Long beans", tag: ["vegetable"] },
      { name: "Garlic", tag: ["vegetable"] },
      { name: "Carrot", tag: ["vegetable"] },
      { name: "Cabbage", tag: ["vegetable"] },
      { name: "Broccoli", tag: ["vegetable"] },
      { name: "Spinach", tag: ["vegetable"] },
    ],
  },
  R: {
    probability: 0.05,
    items: [
      { name: "Banana", tag: ["fruit"] },
      { name: "Apple", tag: ["fruit"] },
      { name: "Orange", tag: ["fruit"] },
      { name: "Blueberry", tag: ["fruit"] },
      { name: "Mango", tag: ["fruit"] },
      { name: "Pineapple", tag: ["fruit"] },
      { name: "Cherry", tag: ["fruit"] },
      { name: "Grape", tag: ["fruit"] },
      { name: "Strawberry", tag: ["fruit"] },
      { name: "Watermelon", tag: ["fruit"] },
    ],
  },
  E: {
    probability: 0.01,
    items: [
      { name: "Bronze", tag: ["mineral"] },
      { name: "Silver", tag: ["mineral"] },
      { name: "Gold", tag: ["mineral"] },
      { name: "Platinum", tag: ["mineral"] },
      { name: "Steel", tag: ["mineral"] },
      { name: "Carbon", tag: ["mineral"] },
      { name: "Golden apple", tag: ["unknown"], isRatedUp: true },
    ],
  },
};

// Functions

function rollCount(count: number) {
  rolledItems.value = [];
  const currentTime = Date.now();

  for (let i = 0; i < count; i++) {
    const result = rollGacha();
    const rollTime = currentTime + i;
    rolledItems.value.push(result);

    // Add to roll history array with timestamp
    let newHistoryEntry = {
      rarity: result.rarity,
      name: result.name,
      timestamp: rollTime,
    };

    rollHistory.value.unshift({
      ...newHistoryEntry,
    });
  }

  rollHistory.value.sort((a, b) => b.timestamp! - a.timestamp!);
}

function rollGacha(): RollResult {
  pityCounter.value.rare++;
  pityCounter.value.epic++;

  const baseEpicProbability = items["E"].probability;
  const softPityStart = 75;
  const hardPity = 90;

  let rarity: "C" | "R" | "E";

  // Guarantee a rate item within 10 rolls
  if (pityCounter.value.rare >= 10) {
    const guaranteeRoll = Math.random();
    rarity = guaranteeRoll < 0.01 ? "E" : "R";
  }
  // Guarantee an epic item within 90 rolls
  else if (pityCounter.value.epic >= hardPity) {
    rarity = "E";
  }
  // Apply soft pity logic starting from the 75th roll
  else if (pityCounter.value.epic >= softPityStart) {
    const softPityRoll = Math.random();
    const softPityRate =
      baseEpicProbability + (pityCounter.value.epic - softPityStart) * (1 / 15); // Increase the guarantee rate as roll count increase beyond 75.

    if (softPityRoll < softPityRate) {
      rarity = "E";
    } else if (softPityRoll < softPityRate + items["R"].probability) {
      rarity = "R";
    } else {
      rarity = "C";
    }
  }
  // Standard gacha roll
  else {
    const roll = Math.random();
    if (roll < items["E"].probability) {
      rarity = "E";
    } else if (roll < items["R"].probability + items["E"].probability) {
      rarity = "R";
    } else {
      rarity = "C";
    }
  }

  // Reset pity counter when the corresponding rarity item is obtained.
  if (rarity === "R") pityCounter.value.rare = 0;
  if (rarity === "E") {
    pityCounter.value.epic = 0;
    const epicItems = items["E"].items;
    let selectedItem: Item;

    // Check if its guaranteed rated up epic.
    if (isNextEpicRatedUp.value) {
      selectedItem = epicItems.find((item) => item.isRatedUp)!;
      isNextEpicRatedUp.value = false; // Reset the 50/50;
    } else {
      // 50/50 chance to get the rated-up item.
      const isRatedUp = Math.random() < 0.5;

      // The rated up item is drawn
      if (isRatedUp) {
        selectedItem = epicItems.find((item) => item.isRatedUp)!;
        isNextEpicRatedUp.value = false; // Reset the 50/50
      } else {
        // Draw among non-rated up epic item
        let nonRatedUpEpics = epicItems.filter((item) => !item.isRatedUp);
        selectedItem =
          nonRatedUpEpics[Math.floor(Math.random() * nonRatedUpEpics.length)];
        isNextEpicRatedUp.value = true; // Guarantees the rated up on next epic draw.
      }
    }

    // Returns the epic item.
    return { rarity, name: selectedItem.name };
  }

  // Handle other rarities
  const selectedItem =
    items[rarity].items[Math.floor(Math.random() * items[rarity].items.length)];
  return { rarity, name: selectedItem.name };
}

function rarityClass(rarity: "C" | "R" | "E") {
  return {
    "bg-amber-400": rarity === "E",
    "bg-purple-400": rarity === "R",
    "bg-blue-400": rarity === "C",
  };
}

const openItemsModal = () => {
  document.body.classList.add("modal-open");
  isItemsModalVisible.value = true;
};

const closeItemsModal = () => {
  document.body.classList.remove("modal-open");
  isItemsModalVisible.value = false;
};

const openHistoryModal = () => {
  document.body.classList.add("modal-open");
  isHistoryModalVisible.value = true;
};

const closeHistoryModal = () => {
  document.body.classList.remove("modal-open");
  isHistoryModalVisible.value = false;
};
</script>
