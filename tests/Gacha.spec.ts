import { shallowMount } from "@vue/test-utils";
import Gacha from "../components/Gacha.vue";

// Define the RollResult type
type RollResult = {
  rarity: "C" | "R" | "E";
  name: string;
  timestamp?: number;
};

// Define the type of the Vue component instance
interface GachaComponent {
  rolledItems: RollResult[]; // Adjust to match actual type in the component
}

describe("Gacha.vue", () => {
  it("Renders roll buttons", () => {
    const wrapper = shallowMount(Gacha);
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("Correctly simulates a roll", async () => {
    const wrapper = shallowMount(Gacha);

    // Trigger the roll action
    const rollButton = wrapper.find("button"); // Update this selector if needed
    await rollButton.trigger("click");

    // Access rolledItems with type assertion
    const instance = wrapper.vm as unknown as GachaComponent; // Type assertion to match our custom type
    expect(instance.rolledItems.length).toBeGreaterThan(0);
  });
});
