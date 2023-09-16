import { getLocalstorage } from "../../utilities";
import { create } from "zustand";

const useFeedPreferencesStore = create<any>((set, get) => ({
	preferences: getLocalstorage("FeedPreferences") || {},

	setPreferences: (preferences) => set(() => ({ preferences })),

	updatePreference: (ID, data) => {
		const preferences = { ...get().preferences };
		preferences[ID] = { ...preferences[ID], ...data };

		set({
			preferences,
		});

		localStorage.setItem("FeedPreferences", JSON.stringify(preferences));
	},

	togglePreference: (ID, key, value = !get().preferences?.[ID]?.[key]) => {
		get().updatePreference(ID, { [key]: value });
	},
}));

const useFeedPreferences = () => useFeedPreferencesStore((state) => state.preferences);
const useSetFeedPreferences = () => useFeedPreferencesStore((state) => state.setPreferences);
const useToggleFeedPreference = () => useFeedPreferencesStore((state) => state.togglePreference);
const useUpdateFeedPreference = () => useFeedPreferencesStore((state) => state.updatePreference);

export { useFeedPreferences, useSetFeedPreferences, useToggleFeedPreference, useUpdateFeedPreference };
