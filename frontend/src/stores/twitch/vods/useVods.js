import TwitchAPI from "./../../../pages/twitch/API";
import { create } from "zustand";

import API from "../../../pages/navigation/API";

import { useEffect } from "react";
import { getLocalstorage, setLocalStorage } from "../../../utilities";
import getFollowedVods from "./../../../pages/twitch/vods/GetFollowedVods";

import AddVideoExtraData from "./../../../pages/twitch/AddVideoExtraData";
import SortAndAddExpire from "./../../../pages/twitch/vods/SortAndAddExpire";
import { addVodEndTime } from "./../../../pages/twitch/TwitchUtils";
import { uniqBy } from "lodash";

const vodExpire = 3; // Number of hours

const useVodsStore = create((set, get) => ({
	loaded: false,
	loading: true,
	error: null,
	vodError: null,
	setError: (error) => set(() => ({ error })),
	setLoading: (loading) => set(() => ({ loading })),
	setLoaded: (loaded) => set(() => ({ loaded })),
	setVodError: (vodError) => set(() => ({ vodError })),

	channels: getLocalstorage("TwitchVods-Channel") || [],
	setChannels: async (channels) => {
		setLocalStorage("TwitchVods-Channel", channels);
		set({ channels });
		return channels;
	},
	vods: getLocalstorage("TwitchVods") || [],
	setVods: (vods) => {
		setLocalStorage("TwitchVods", vods);
		set({ vods });
	},
	enabled: false,
	setEnabled: (enabled) => set({ enabled }),

	addVodChannel: async ({ channel }) => {
		try {
			const existingChannels = new Set(get().channels);
			existingChannels.add(channel.user_id);

			get().setChannels([...existingChannels]);

			await API.addVodChannel(channel.user_id);
		} catch (e) {
			console.log("addVodChannel error: ", e.message);
		}
	},

	removeChannel: async ({ channel }) => {
		try {
			const vodChannels = new Set(get().channels || []);
			vodChannels.delete(channel?.user_id);

			get().setChannels([...vodChannels]);

			API.removeVodChannel(channel?.user_id);

			const existingVodVideos = get().vods || { data: [] };
			const newVodVideos = {
				...existingVodVideos,
				data: existingVodVideos.data.filter((video) => video?.user_id !== channel?.user_id)?.slice(0, 100),
			};
			get().setVods(newVodVideos);
		} catch (e) {
			console.log("removeChannel error: ", e.message);
		}
	},

	fetchChannelVods: async ({ user_id, amount = 1, check = false } = {}) => {
		if (check && !get().channels?.includes(user_id)) return null;
		// if (check && (!vods?.enabled || !channels?.includes(user_id))) return null;

		return await TwitchAPI.getVideos({
			user_id: user_id,
			period: "month",
			first: amount,
			type: "all",
		}).then(async (res) => {
			const newVodWithProfile = (await AddVideoExtraData({ items: res.data })) || [];
			const newVodWithEndtime = (await addVodEndTime(newVodWithProfile.data)) || [];

			const existingVods = get().vods?.data ? [...(get().vods?.data || [])] : [];
			const vodsToAdd = [
				...newVodWithEndtime.slice(0, amount).map((vod) => ({
					...vod,
					transition: "videoFadeSlide",
				})),
			];
			const uniqueVods = uniqBy([...(vodsToAdd || []), ...(existingVods || [])]?.slice(0, 100), "id");
			const FinallVods = SortAndAddExpire(uniqueVods, vodExpire, get().vods.loaded, get().vods.expire) || [];

			get().setVods(FinallVods);
		});
	},

	fetchChannels: async () => {
		const channels = await API.getVodChannels();
		get().setChannels(channels);

		return channels;
	},

	fetch: async (forceRun) => {
		set({ loading: true });

		const data = await getFollowedVods({
			forceRun,
			channels: get().channels,
			currentVods: get().vods,
		});

		set({ loading: false, loaded: true, vods: data?.data, error: data?.er, vodError: data?.vodError });

		if (data?.data) get().setVods(data?.data);

		return data?.data;
	},

	initialFetch: async () => {
		if (!get().loaded) {
			console.log("initialFetch useVods");
			set({ loading: true, loaded: true });

			try {
				const channels = await get().fetchChannels();
				await get().setChannels(channels);

				return await get().fetch();
			} catch (error) {
				console.log("error:", error);
				set({ error });
				return null;
			} finally {
				set({ loading: false });
			}
		}
	},
}));

const useVods = () => {
	const vods = useVodsStore((state) => state.vods);
	const initialFetch = useVodsStore((state) => state.initialFetch);

	useEffect(() => {
		initialFetch();
	}, [initialFetch]);

	return vods;
};

const useVodsChannels = () => useVodsStore((state) => state.channels);
const useVodsLoading = () => useVodsStore((state) => state.loading);
const useVodsLoaded = () => useVodsStore((state) => state.loaded);
const useVodsError = () => ({
	error: useVodsStore((state) => state.error),
	setError: useVodsStore((state) => state.setError),

	vodError: useVodsStore((state) => state.vodError),
	setVodError: useVodsStore((state) => state.setVodError),
});
const useVodsEnabled = () => useVodsStore((state) => state.enabled);
const useVodsSetEnabled = () => useVodsStore((state) => state.setEnabled);
const useVodsFetch = () => useVodsStore((state) => state.fetch);

const useVodsAddVodChannel = () => useVodsStore((state) => state.addVodChannel);
const useVodsRemoveChannel = () => useVodsStore((state) => state.removeChannel);
const useVodsFetchChannelVods = () => useVodsStore((state) => state.fetchChannelVods);

export {
	useVods,
	useVodsChannels,
	useVodsLoading,
	useVodsLoaded,
	useVodsError,
	useVodsEnabled,
	useVodsSetEnabled,
	useVodsFetch,
	useVodsAddVodChannel,
	useVodsRemoveChannel,
	useVodsFetchChannelVods,
};
