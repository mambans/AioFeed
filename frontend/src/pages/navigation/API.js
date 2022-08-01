import { Auth } from "aws-amplify";
import axios from "axios";
import { AddCookie, getCookie } from "../../util";
import addLogBase from "../logs/addLogBase";

const INSTANCE = axios.create({
	baseURL: "https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod",
	timeout: 5000,
});
const controller = new AbortController();

INSTANCE.interceptors.request.use(
	async (config) => {
		const session = await Auth.currentSession();
		if (session) {
			config.headers["Authorization"] = session?.idToken?.jwtToken;
		}
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

INSTANCE.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		// console.log("INSTANCE error:", error);
		return Promise.reject(error);
	}
);

const API = {
	validateAccount: async (username) => await INSTANCE.post(`/account/validate`, {}),
	createSavedList: async (id, values) =>
		await INSTANCE.post(`/savedlists`, {
			id: id,
			obj: values,
		}).catch((e) => console.error(e)),

	updateSavedList: async (id, values) =>
		await INSTANCE.put(`/savedlists`, {
			id: id,
			obj: values,
		}).catch((e) => console.error(e)),

	getSavedList: async () =>
		await INSTANCE.get(`/savedlists`, {
			params: {},
		})
			.then((res) => {
				return res.data;
			})
			.catch((e) => console.error(e)),

	deleteSavedList: async (id) =>
		await INSTANCE.put(`/savedlists/delete`, {
			id,
		}).catch((e) => console.error(e)),

	deleteYoutubeToken: async () =>
		await INSTANCE.delete(`/youtube/token`, {
			data: {},
		})
			.then(() => console.log(`Successfully disconnected from Youtube`))
			.catch((e) => console.error(e)),

	getYoutubeTokens: async (codeFromUrl) => {
		const data = {};

		if (codeFromUrl) data.code = codeFromUrl;

		return await INSTANCE.post(`/youtube/token`, data)
			.then(async (res) => {
				if (res.data.access_token || res.data.refresh_token) {
					console.log("YouTube: New Access token fetched");
					addLogBase({
						title: "YouTube re-authenticated",
						text: "Successfully re-authenticated to YouTube (renewed access token)",
						icon: "youtube",
					});
					return {
						access_token: res.data.access_token,
						refresh_token: res.data.refresh_token,
					};
				}
			})
			.catch((e) => console.error(e));
	},

	getAppAccessToken: async () =>
		await INSTANCE.get(`/app/token`)
			.then((res) => {
				const { access_token, expires_in } = res?.data || {};
				const expireData = new Date(expires_in * 1000);
				AddCookie("Twitch-app_token", access_token, { expires: expireData });
				return res;
			})
			.catch((e) => {
				console.error(e);
				console.error("No User or App access tokens found.");
			}),

	createCustomFeedSections: async ({ id, data }) => {
		return await INSTANCE.post(`/custom_feed_sections`, {
			id,
			data,
		}).catch((e) => console.error(e));
	},
	fetchCustomFeedSections: async () =>
		await INSTANCE.get(`/custom_feed_sections`, {
			params: {},
		})
			.then((res) => {
				return res.data;
			})
			.catch((e) => console.error(e)),

	deleteCustomFeedSections: async (id) =>
		await INSTANCE.delete(`/custom_feed_sections`, {
			data: {
				id,
			},
		}).catch((e) => console.error(e)),

	updateCustomFeedSections: async (id, data) => {
		return await INSTANCE.put(`/custom_feed_sections`, {
			id,
			data,
		}).catch((e) => console.error(e));
	},
	//new refactored to seperate tables
	changeProfileImage: async (data) =>
		await INSTANCE.put(`/account/profile-image`, {
			data,
		}).catch((e) => console.error(e)),

	updateTwitchUserData: async (data, access_token, refresh_token) =>
		await INSTANCE.put(`/twitch/user`, {
			data,
			access_token,
			refresh_token,
		}).catch((e) => console.error(e)),
	updateYoutubeUserData: async (data, access_token, refresh_token) =>
		await INSTANCE.put(`/youtube/user`, {
			data,
			access_token,
			refresh_token,
		}).catch((e) => console.error(e)),

	getTwitchData: async () =>
		await INSTANCE.get(`/twitch`, {
			params: {},
		}).catch((e) => console.error(e)),

	updateFavoriteStreams: async (value) =>
		await INSTANCE.put(`/twitch/favorite_streams`, {
			channels: [...value],
		}).catch((e) => console.error(e)),

	addVodChannel: async (channel_id) =>
		await INSTANCE.put(`/twitch/vod-channels`, {
			channel_id,
		}).catch((e) => console.error(e)),

	removeVodChannel: async (channel_id) =>
		await INSTANCE.delete(`/twitch/vod-channels`, {
			data: {
				channel_id,
			},
		}).catch((e) => console.error(e)),

	getVodChannel: async () =>
		await INSTANCE.get(`/twitch/vod-channels`, {
			params: {},
		}).catch((e) => console.error(e)),

	addUdateChannels: async (channels) =>
		await INSTANCE.put(`/twitch/update-notis-channels`, {
			channels,
		}).catch((e) => console.error(e)),

	deleteTwitchDataUser: async () =>
		await INSTANCE.delete(`/twitch/user`, {
			data: {},
		})
			.then(() => console.log(`Successfully disconnected from Twitch`))
			.catch((e) => console.error(e)),

	updateTwitchToken: async (setTwitchToken, setRefreshToken) => {
		controller.abort();
		return await INSTANCE.put(`/twitch/reauth`, {
			refresh_token: getCookie(`Twitch-refresh_token`),
			signal: controller.signal,
		}).then(async (res) => {
			console.log("res.data.access_token:", res.data.access_token);
			if (setTwitchToken) setTwitchToken(res.data.access_token);
			if (setRefreshToken) setRefreshToken(res.data.refresh_token);
			AddCookie("Twitch-access_token", res.data.access_token);
			AddCookie("Twitch-refresh_token", res.data.refresh_token);
			if (res?.data?.access_token) console.log("Successfully re-authenticated to Twitch.");
			addLogBase({
				title: "Twitch re-authenticated",
				text: "Successfully re-authenticated to Twitch (renewed access token)",
				icon: "twitch",
			});

			console.log("res00:", res);
			return res;
		});
	},

	getTwitchAccessToken: async (value) =>
		await INSTANCE.put(`/twitch/request_auth`, {
			authCode: value,
		}).catch((e) => console.error(e)),
	getYoutubeData: async () =>
		await INSTANCE.get(`/youtube`, {
			params: {},
		}).catch((e) => console.error(e)),
	addTwitterList: async (data) =>
		await INSTANCE.put(`/twitter`, {
			data,
		}).catch((e) => console.error(e)),
	getTwitterLists: async (data) =>
		await INSTANCE.get(`/twitter`, {
			params: {},
		}).catch((e) => console.error(e)),
	getChatState: async ({ channel_id }) =>
		await INSTANCE.get(`/chatstates`, {
			params: {
				channel_id: channel_id,
			},
		})
			.then((res) => res.data?.Item)
			.catch((e) => console.error(e)),

	updateChateState: async ({ data, channel_id }) =>
		await INSTANCE.put(`/chatstates`, {
			channel_id,
			data,
		}).catch((e) => console.error(e)),

	deleteChateState: async ({ channel_id }) =>
		await INSTANCE.delete(`/chatstates`, {
			data: {
				channel_id,
			},
		}).catch((e) => console.error(e)),
};

export default API;
