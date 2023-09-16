import { create } from "zustand";

import TwitchAPI, { pagination } from "../../../pages/twitch/API";
import decorateStreams from "./decorateStreams";
// import TwitchAPI, { pagination } from "../../pages/twitch/API";

//!TODO: Impelement Abortcontroller to cancel fetches, and return a function that can be used outside to cancel thr fetch

interface StreamStore {
	livestreams: any[];
	previousStreams: any[] | null;
	newlyAddedStreams: any[];
	loading: boolean;
	canPushNoitifications: boolean;
	followedChannels: any[];
	loaded: boolean;

	error: any;
	updateStreams: (streams: any[]) => any;
	fetch: (twitchUserId: string) => any;
	setLivestreams: (livestreams: any[]) => any;
	setPreviousStreams: (previousStreams: any[]) => any;
	setNewlyAddedStreams: (newlyAddedStreams: any[]) => any;
	setFollowedChannels: (followedChannels: any[]) => any;
	setFollowedChannels: (loaded: any[]) => any;
}

const useStreamsStore = create<StreamStore>((set, get) => ({
	livestreams: [],
	previousStreams: null,
	newlyAddedStreams: [],
	error: null,
	loading: false,
	canPushNoitifications: false,
	followedChannels: [],
	loaded: false,

	setLivestreams: (livestreams: StreamStore["livestreams"]) => set(() => ({ livestreams })),
	setPreviousStreams: (previousStreams: StreamStore["previousStreams"]) => set(() => ({ previousStreams })),
	setNewlyAddedStreams: (newlyAddedStreams: StreamStore["newlyAddedStreams"]) => set(() => ({ newlyAddedStreams })),
	setFollowedChannels: (followedChannels: StreamStore["followedChannels"]) => set(() => ({ followedChannels })),

	updateStreams: (streams) => {
		const previousStreams: StreamType[] = [];
		const livestreams: StreamType[] = [];
		const newlyAddedStreams: StreamType[] = [];

		streams.forEach((stream) => {
			const previousStream = get().previousStreams?.find((previousStream) => previousStream.id === stream.id);

			if (previousStream) {
				livestreams.push(stream);
			} else {
				newlyAddedStreams.push(stream);
			}
		});

		set({
			livestreams: streams,
			previousStreams: get().livestreams,
			newlyAddedStreams,
			canPushNoitifications: !!get().previousStreams,
			loaded: true,
		});
		return { livestreams: streams, previousStreams, newlyAddedStreams };
	},

	fetch: async (twitchUserId, refreshMetadata = false) => {
		console.log("fetch:");

		try {
			set({ loading: true });
			const streams = await pagination(
				await TwitchAPI.getFollowedStreams({
					user_id: twitchUserId,
					first: 100,
					// signal: controller.current?.signal,
				}).catch((e) => {
					console.log("catch:", e);
					if (e.response.data.status) {
						// addSystemNotification({
						// 	title: "Error fetching followed streams",
						// 	body: `${e.response.data.status} - ${e.response.data.message}`,
						// });
					}
					return e.response.data;
				})
			);

			const { decoratedStreams, error } = await decorateStreams(streams || get().previousStreams, refreshMetadata);
			set({ error });

			return get().updateStreams(decoratedStreams);
		} catch (error) {
			console.log("error:", error);
			set({ error });
			return { error, livestreams: get().livestreams, previousStreams: get().previousStreams, newlyAddedStreams: get().newlyAddedStreams };
		} finally {
			set({ loading: false });
		}
	},
}));

export default useStreamsStore;
