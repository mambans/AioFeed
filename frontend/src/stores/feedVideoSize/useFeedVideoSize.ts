import { getLocalstorage } from "src/utilities";
import { create } from "zustand";

const useFeedVideoSizeStore = create<any>((set, get) => ({
	size: getLocalstorage("FeedVideoSize") || 100,

	setSize: (size) => {
		set(() => ({ size }));
		localStorage.setItem("FeedVideoSize", size);
	},
}));

const useFeedVideoSize = () => useFeedVideoSizeStore((state) => state.size);
const useSetFeedVideoSize = () => useFeedVideoSizeStore((state) => state.setSize);

const useFeedVideoSizeObject = () =>
	useFeedVideoSizeStore((state) => ({
		width: 336 * (parseInt(state.size) / 100),
		height: 336 * (parseInt(state.size) / 100) * 0.97, // only used for amount of video elements
		margin: 7 * (parseInt(state.size) / 100),
		fontSize: 16 * (parseInt(state.size) / 100),
		totalWidth: 7 * (parseInt(state.size) / 100) * 2 + 336 * (parseInt(state.size) / 100),
		totalHeight: 336 * (parseInt(state.size) / 100) * 0.97 + 7 * (parseInt(state.size) / 100),
		transition: "videoFadeSlide",
	}));

export { useFeedVideoSize, useSetFeedVideoSize, useFeedVideoSizeObject };
