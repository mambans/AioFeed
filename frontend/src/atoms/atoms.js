import { Auth } from "aws-amplify";
import { atom, selector, useSetRecoilState } from "recoil";
import { getLocalstorage } from "../util";
import { localStorageEffect } from "./effects";

export const userAtom = atom({
	key: "user",
	default: null,
	effects: [
		({ setSelf, onSet }) => {
			(async () => {
				const user = await Auth.currentAuthenticatedUser();
				console.log("user:", user);

				setTimeout(() => {
					setSelf(JSON.parse(JSON.stringify(user)));
				}, 3000);
			})();

			return () => {};
		},
	],
});

export const userLoadingAtom = atom({
	key: "userLoading", // unique ID (with respect to other atoms/selectors)
	default: true, // default value (aka initial value)
});

export const feedPreferencesAtom = atom({
	key: "feedPreferencesAtom", // unique ID (with respect to other atoms/selectors)
	default: getLocalstorage("FeedPreferences") || {}, // default value (aka initial value)
	effects: [localStorageEffect("FeedPreferences")],
});

export const feedVideoSizeAtom = atom({
	key: "feedVideoSizeAtom", // unique ID (with respect to other atoms/selectors)
	default: getLocalstorage("FeedVideoSize") || 100, // default value (aka initial value)
	effects: [localStorageEffect("FeedVideoSize")],
});
export const feedVideoSizePropsAtom = selector({
	key: "feedVideoSizePropsAtom", // unique ID (with respect to other atoms/selectors)
	default: {}, // default value (aka initial value)
	get: ({ get }) => {
		const size = get(feedVideoSizeAtom);

		return {
			width: 336 * (parseInt(size) / 100),
			height: 336 * (parseInt(size) / 100) * 0.97, // only used for amount of video elements
			margin: 7 * (parseInt(size) / 100),
			fontSize: 16 * (parseInt(size) / 100),
			totalWidth: 7 * (parseInt(size) / 100) * 2 + 336 * (parseInt(size) / 100),
			totalHeight: 336 * (parseInt(size) / 100) * 0.97 + 7 * (parseInt(size) / 100),
			transition: "videoFadeSlide",
		};
	},
});

// export const vodChannelsSelector = selector({
//   key: 'vodChannelsSelector', // unique ID (with respect to other atoms/selectors)
//   default: [], // default value (aka initial value)
//   get: async () => {
//     return await API.getVodChannels();
//   },
//   set: ({ set }, newValue) => set(vodChannelsSelector, newValue),
// });

export const useFeedPreferences = () => {
	const setFeedPreferences = useSetRecoilState(feedPreferencesAtom);

	const toggleExpanded = (ID) => {
		setFeedPreferences((feedPreferences) => {
			return {
				...feedPreferences,
				[ID]: { ...feedPreferences[ID], collapsed: !feedPreferences?.[ID]?.collapsed },
			};
		});
	};
	const toggleSidebarExpanded = (ID) => {
		setFeedPreferences((feedPreferences = {}) => {
			return {
				...feedPreferences,
				[ID]: {
					...feedPreferences[ID],
					sidebar_collapsed: !feedPreferences?.[ID]?.sidebar_collapsed,
				},
			};
		});
	};
	const toggleEnabled = (ID, value = null) => {
		setFeedPreferences((feedPreferences = {}) => {
			return {
				...feedPreferences,
				[ID]: {
					...feedPreferences[ID],
					enabled: value ?? !feedPreferences?.[ID]?.enabled,
				},
			};
		});
	};
	const toggleSidebar = (ID, value = null) => {
		setFeedPreferences((feedPreferences = {}) => {
			return {
				...feedPreferences,
				[ID]: {
					...feedPreferences[ID],
					sidebar_enabled: value ?? !feedPreferences?.[ID]?.sidebar_enabled,
				},
			};
		});
	};
	const setOrder = (ID, order) => {
		setFeedPreferences((feedPreferences = {}) => {
			return {
				...feedPreferences,
				[ID]: {
					...feedPreferences[ID],
					order,
				},
			};
		});
	};

	return { toggleExpanded, toggleSidebarExpanded, toggleEnabled, setOrder, toggleSidebar };
};
