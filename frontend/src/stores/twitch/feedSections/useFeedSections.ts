import { create } from "zustand";
import API from "../../../pages/navigation/API";
import { useEffect } from "react";

const useFeedSectionsStore = create<any>((set, get) => ({
	feedSections: {},
	loaded: false,
	loading: true,
	error: null,

	setUser: (user) => set(() => ({ user })),
	setError: (error) => set(() => ({ error })),
	setLoading: (loading) => set(() => ({ loading })),

	createFeedSection: async (title) => {
		const id = Date.now();
		const data = {
			id,
			title,
			enabled: true,
			notifications_enabled: true,
			nonFeedSectionLiveStreams: false,
			sidebar_enabled: true,
			rules: [],
		};

		set({
			feedSections: {
				...get().feedSections,
				[id]: data,
			},
		});

		// toggleEnabled(id);
		API.createCustomFeedSections({ id, data });
	},

	deleteFeedSection: (id) => {
		const feedSections = { ...get().feedSections };
		delete feedSections[id];

		set({
			feedSections,
		});

		API.deleteCustomFeedSections(id);
	},

	editFeedSection: async (id, data) => {
		set({
			feedSections: {
				...get().feedSections,
				[id]: {
					...get().feedSections[id],
					...data,
				},
			},
		});

		API.updateCustomFeedSections(id, { title });
	},

	addFeedSectionRule: (id, rule) => {
		const rules = (() => {
			const feedSections = get().feedSections;

			const existingRule = rule?.id && feedSections?.[id]?.rules.findIndex((r) => r.id === rule?.id);

			if (existingRule !== undefined && existingRule >= 0) {
				const rules = [...(feedSections?.[id]?.rules || [])];
				rules.splice(existingRule, 1, rule);
				return rules;
			}

			return [{ ...rule, id: Date.now() }, ...(get().feedSections?.[id]?.rules || [])];
		})();

		const newFeedSection = {
			...get().feedSections[id],
			rules,
		};

		set({
			feedSections: {
				...get().feedSections,
				[id]: newFeedSection,
			},
		});

		API.updateCustomFeedSections(id, { rules });
	},

	deleteFeedSectionRule: (id, rule) => {
		const rules = get().feedSections[id].rules.filter((r) => r.id !== rule.id);

		set({
			feedSections: {
				...get().feedSections,
				[id]: { ...get().feedSections[id], rules },
			},
		});

		API.updateCustomFeedSections(id, { rules });
	},

	toggleFeedSection: (id: number, setting: string) => {
		const state = !get().feedSections[id][setting];

		set({
			feedSections: {
				...get().feedSections,
				[id]: { ...get().feedSections[id], [setting]: state },
			},
		});

		API.updateCustomFeedSections(id, { [setting]: state });
	},

	initialFetch: async () => {
		if (!get().loaded) {
			set({ loading: true, loaded: true });

			const { Items } = (await API.fetchCustomFeedSections()) || {};

			const sections = Items?.reduce((acc, curr) => {
				return {
					...acc,
					[curr.id]: curr,
				};
			}, {});

			if (sections) {
				set({ feedSections: sections });
			}

			set({ loading: true });
		}
	},
}));

const useFeedSections = () => {
	const feedSections = useFeedSectionsStore((state) => state.feedSections);
	const initialFetch = useFeedSectionsStore((state) => state.initialFetch);

	useEffect(() => {
		initialFetch();
	}, [initialFetch]);

	return feedSections;
};

const useFeedSectionsSetFeedSections = () => useFeedSectionsStore((state) => state.setFeedSections);
const useFeedSectionsLoading = () => useFeedSectionsStore((state) => state.loading);
const useFeedSectionsError = () => ({
	error: useFeedSectionsStore((state) => state.error),
	setError: useFeedSectionsStore((state) => state.setError),
});
const useFeedSectionsLoaded = () => useFeedSectionsStore((state) => state.loaded);
const useFeedSectionsCreateFeedSection = () => useFeedSectionsStore((state: { createFeedSection: any }) => state.createFeedSection);
const useFeedSectionsDeleteFeedSection = () => useFeedSectionsStore((state) => state.deleteFeedSection);
const useFeedSectionsEditFeedSection = () => useFeedSectionsStore((state) => state.editFeedSection);
const useFeedSectionsAddFeedSectionRule = () => useFeedSectionsStore((state) => state.addFeedSectionRule);
const useFeedSectionsDeleteFeedSectionRule = () => useFeedSectionsStore((state) => state.deleteFeedSectionRule);
const useFeedSectionsToggleFeedSection = () => useFeedSectionsStore((state) => state.toggleFeedSection);

export {
	useFeedSections,
	useFeedSectionsSetFeedSections,
	useFeedSectionsLoading,
	useFeedSectionsError,
	useFeedSectionsLoaded,
	useFeedSectionsCreateFeedSection,
	useFeedSectionsDeleteFeedSection,
	useFeedSectionsEditFeedSection,
	useFeedSectionsAddFeedSectionRule,
	useFeedSectionsDeleteFeedSectionRule,
	useFeedSectionsToggleFeedSection,
};
