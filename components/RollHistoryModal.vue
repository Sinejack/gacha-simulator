<!-- components/RollHistoryModal.vue -->
<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
    @click="handleOverlayClick">
    <div
      class="bg-orange-50 p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-auto"
      @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Roll History</h2>
        <div>
          <button
            type="button"
            @click="closeModal"
            class="text-gray-500 hover:text-gray-700 text-2xl bg-red-700 px-4 py-1 text-white rounded">
            X
          </button>
        </div>
      </div>
      <div v-if="history.length > 0">
        <table class="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 px-4 py-2">Rarity</th>
              <th class="border border-gray-300 px-4 py-2">Item name</th>
              <th class="border border-gray-300 px-4 py-2">Date and Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in history" :key="index">
              <td
                class="border border-gray-300 px-4 py-2"
                :class="rarityClass(entry.rarity)">
                {{ rarityText(entry.rarity) }}
              </td>
              <td
                class="border border-gray-300 px-4 py-2"
                :class="rarityClass(entry.rarity)">
                {{ entry.name }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                {{ formatTimestamp(entry.timestamp) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>No roll history available.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Interfaces
interface HistoryEntry {
  rarity: "C" | "R" | "E";
  name: string;
  timestamp: number;
}

const props = defineProps<{
  isVisible: boolean;
  history: HistoryEntry[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const closeModal = () => {
  emit("close");
};

const handleOverlayClick = () => {
  closeModal();
};

// Function to determine CSS class based on rarity.
function rarityClass(rarity: "C" | "R" | "E") {
  return {
    "text-amber-400": rarity === "E",
    "text-purple-400": rarity === "R",
    "text-blue-400": rarity === "C",
  };
}

// Function to map rarity to text.
function rarityText(rarity: "C" | "R" | "E") {
  return { E: "Epic", R: "Rare", C: "Common" }[rarity];
}

// Function to format the timestamp.
function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}
</script>
