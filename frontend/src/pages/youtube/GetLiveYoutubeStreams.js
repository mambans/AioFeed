import axios from "axios";
import { setLocalStorage } from "../../utilities";

async function GetLiveYoutubeStreams(channel) {
	try {
		let liveStreams = [];
		let liveResponse = null;

		localStorage.getItem(`live-${channel}`)
			? (liveResponse = await axios
					.get(`https://www.googleapis.com/youtube/v3/search?`, {
						params: {
							part: "snippet",
							channelId: channel,
							eventType: "live",
							maxResults: 1,
							type: "video",
							key: process.env.REACT_APP_YOUTUBE_API_KEY,
						},
						headers: {
							"If-None-Match": JSON.parse(localStorage.getItem(`live-${channel}`)).data.etag,
						},
					})
					.catch(function (error) {
						console.error(error);
						return JSON.parse(localStorage.getItem(`live-${channel}`));
					}))
			: (liveResponse = await axios
					.get(`https://www.googleapis.com/youtube/v3/search?`, {
						params: {
							part: "snippet",
							channelId: channel,
							eventType: "live",
							maxResults: 1,
							type: "video",
							key: process.env.REACT_APP_YOUTUBE_API_KEY,
						},
					})
					.catch((error) => {
						console.log(error);
					}));

		setLocalStorage(`live-${channel}`, liveResponse);

		if (liveResponse.data.items.length >= 1) {
			liveStreams = await Promise.all(
				liveResponse.data.items.map(async (stream) => {
					const liveDetailsResponse = await axios
						.get(`https://www.googleapis.com/youtube/v3/videos?`, {
							params: {
								part: "liveStreamingDetails",
								id: stream.id.videoId,
								key: process.env.REACT_APP_YOUTUBE_API_KEY,
							},
						})
						.catch((error) => {
							console.log(error);
						});

					stream.snippet.publishedAt = liveDetailsResponse.data.items[0].liveStreamingDetails.actualStartTime;

					stream.df = "liveYoutube";

					stream.duration = liveDetailsResponse.data.items[0].liveStreamingDetails.actualStartTime;

					stream.contentDetails = {
						upload: {
							videoId: stream.id.videoId,
						},
					};
					return stream;
				})
			);
		}
		return liveStreams;
	} catch (e) {
		console.error("-Error: ", e);
		this.setState({
			error: e.message,
		});
	}
}

export default GetLiveYoutubeStreams;
