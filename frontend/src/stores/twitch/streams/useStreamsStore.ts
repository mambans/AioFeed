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

	updateStreams: (streams: StreamType[]) => {
		const newlyAddedStreams: StreamType[] = get().newlyAddedStreams || [];
		const previousStreams = get().previousStreams;

		streams.forEach((stream:StreamType) => {
			const previousStream = previousStreams?.find((previousStream:StreamType) => previousStream.user_id === stream.user_id);

			if (!previousStream && !!previousStreams) {
				newlyAddedStreams.push(stream);
			}
		});

		set({
			livestreams: streams,
			previousStreams: get().livestreams,
			newlyAddedStreams,
			canPushNoitifications: !!previousStreams,
			loaded: true,
			error: null,
		});
		return { livestreams: streams, previousStreams: get().livestreams, newlyAddedStreams };
	},

	fetch: async (twitchUserId, refreshMetadata = false) => {
		try {
			set({ loading: true });
			const streams = await pagination(
				await TwitchAPI.getFollowedStreams({
					user_id: twitchUserId,
					first: 100,
					// signal: controller.current?.signal,
				})
			);

			const decoratedStreams = await decorateStreams(streams || get().previousStreams, refreshMetadata);

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
