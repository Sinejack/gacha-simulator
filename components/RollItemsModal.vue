<!-- components/Modal.vue -->
<style scoped>
body.modal-open {
  overflow: hidden;
}
</style>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
    @click="handleOverlayClick">
    <div
      class="bg-orange-50 p-8 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-auto"
      @click.stop>
      <div class="text-right">
        <button
          type="button"
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 text-2xl bg-red-700 px-4 py-1 text-white rounded">
          X
        </button>
      </div>

      <div>
        <h2 class="text-xl font-bold">Gacha rates:</h2>
        <ul class="list-disc pl-8 mt-2">
          <li class="text-blue-400">Common: 94%</li>
          <li class="text-purple-400">Rare: 5%</li>
          <li class="text-amber-400">Epic: 1%</li>
        </ul>
      </div>

      <div class="flex justify-between items-center mt-4">
        <h2 class="text-xl font-bold">Available Items</h2>
      </div>
      <div class="mt-4">
        <table
          class="table-fixed w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 px-4 py-2 text-center w-1/3">
                Rarity
              </th>
              <th class="border border-gray-300 px-4 py-2 text-center w-2/3">
                Item Name
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(rarity, key) in items" :key="key">
              <template v-for="item in rarity.items" :key="item.name">
                <tr>
                  <td
                    class="border border-gray-300 px-4 py-2 font-normal text-center"
                    :class="rarityClass(key)">
                    {{ rarityText(key) }}
                  </td>
                  <td
                    class="border border-gray-300 px-4 py-2 font-normal text-center"
                    :class="rarityClass(key)">
                    {{ item.name }}
                    <span v-if="item.isRatedUp" :class="rarityClass(key)">
                      (Up!)
                    </span>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

// Interfaces and types
type Rarities = "C" | "R" | "E";

interface Item {
  name: string;
  tag: string[];
  isRatedUp?: boolean;
}

interface ItemsPool {
  probability: number;
  items: Item[];
}

const props = defineProps<{
  isVisible: boolean;
  items: Record<Rarities, ItemsPool>;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const closeModal = () => {
  document.body.classList.remove("modal-open");
  emit("close");
};

const handleOverlayClick = () => {
  closeModal();
};

const rarityClass = (rarity: "C" | "R" | "E") => {
  return {
    "text-amber-400": rarity === "E",
    "text-purple-400": rarity === "R",
    "text-blue-400": rarity === "C",
  };
};

const rarityText = (rarity: "C" | "R" | "E") => {
  return { E: "Epic", R: "Rare", C: "Common" }[rarity];
};
</script>
