import { getLocalstorage } from "../../utilities";
import { create } from "zustand";

const getVideoPropsObject = (size: number) => {
	return {
		width: 336 * (size / 100),
		height: 336 * (size / 100) * 0.97, // only used for amount of video elements
		margin: 7 * (size / 100),
		fontSize: 16 * (size / 100),
		totalWidth: 7 * (size / 100) * 2 + 336 * (size / 100),
		totalHeight: 336 * (size / 100) * 0.97 + 7 * (size / 100),
		transition: "videoFadeSlide",
	};
};

const useFeedVideoSizeStore = create<any>((set, get) => ({
	size: getLocalstorage("FeedVideoSize") || 100,
	videoProps: getVideoPropsObject(parseInt(getLocalstorage("FeedVideoSize") || 100)),

	setSize: (size) => {
		set(() => ({
			size,
			videoProps: getVideoPropsObject(parseInt(size)),
		}));
		localStorage.setItem("FeedVideoSize", size);
	},
}));

const useFeedVideoSize = () => useFeedVideoSizeStore((state) => state.size);
const useSetFeedVideoSize = () => useFeedVideoSizeStore((state) => state.setSize);

const useFeedVideoSizeObject = () => useFeedVideoSizeStore((state) => state.videoProps);

export { useFeedVideoSize, useSetFeedVideoSize, useFeedVideoSizeObject };
