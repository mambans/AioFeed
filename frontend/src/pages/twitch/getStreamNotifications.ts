import { durationMsToDate, loginNameFormat, truncate } from "./../../utilities";
import { checkAgainstRules } from "./../feedSections/utilities";

type StreamTypeWithKeys = StreamType & {
	keys: string[];
};

const createKeys = (streams: any[], enabledFeedSections: FeedSectionType[], favoriteStreams): StreamType[] => {
	return streams.reduce((acc, stream: StreamType) => {
		const feedSections = enabledFeedSections?.filter?.(({ rules } = {} as any) => checkAgainstRules(stream, rules, favoriteStreams));
		const feedSectionKeys = feedSections?.map((section) => `${stream.user_id}_${section.id}`) || [];

		const mainKey = `${stream.user_id}`;

		const keys = [mainKey, ...feedSectionKeys];

		return [
			...acc,
			{
				...stream,
				keys,
			},
		];
	}, []) as any;
};

const getStreamNotifications = ({
	currentStreams,
	previousStreams: previousLiveStreams,
	feedSections,
	favoriteStreams,
}: any): StreamNotificationType[] => {
	const enabledFeedSections =
		feedSections && Object.values?.(feedSections)?.filter((f: FeedSectionType | any) => f.enabled && f.notifications_enabled);

	const streams = createKeys(currentStreams || [], enabledFeedSections, favoriteStreams) as StreamTypeWithKeys[];
	const previousStreams = createKeys(previousLiveStreams || [], enabledFeedSections, favoriteStreams) as StreamTypeWithKeys[];

	const streamsWithPreviouosStream = streams.map((stream: StreamTypeWithKeys) => ({
		...stream,
		previousStream: previousStreams?.find?.(({ user_id }) => user_id === stream.user_id),
	}));

	const previouosStreamsWithCurrentStream = previousStreams.map((stream: StreamTypeWithKeys) => ({
		...stream,
		currentStream: streams?.find?.(({ user_id }) => user_id === stream.user_id),
	}));

	// !stream.keys.every((value) => stream.previousStream?.keys.includes(value)) &&
	// 	!stream.previousStream?.keys.every((value) => stream.keys.includes(value));

	const liveAndUpdatedNotifications = streamsWithPreviouosStream
		.filter(
			(stream) =>
				!stream.previousStream ||
				stream.keys?.some?.((key) => !stream.previousStream?.keys?.includes?.(key)) ||
				stream.previousStream.keys?.some?.((key) => !stream.keys?.includes?.(key))
		)
		.flatMap((stream) => {
			const previousStream = stream.previousStream;
			const feedSections = enabledFeedSections?.filter?.((feedSection: FeedSectionType) =>
				checkAgainstRules(stream, feedSection.rules, favoriteStreams)
			);

			const baseNotis = {
				title: `${loginNameFormat(stream)} went Live`,
				icon: stream?.profile_image_url,
				body: `${stream.title || ""}\n${stream.game_name || stream.game || ""}`,
				onClick: (e) => {
					e.preventDefault();
					window.open("https://aiofeed.com/" + loginNameFormat(stream, true), stream.user_id);
				},
				stream,
				type: "live",
				unread: true,
			};

			if (feedSections?.length) {
				//If I only wanted to return one notis per stream even if multuple feed sections matched,
				//I could sort feedSections here and just return the first one here
				return feedSections?.map((section: FeedSectionType) => {
					if (!previousStream) {
						return {
							...baseNotis,
							title: `${loginNameFormat(stream)} went Live in ${section.title}`,
							requireInteraction: section.is_important || favoriteStreams?.includes?.(stream.user_id),
						};
					}

					return {
						...baseNotis,
						title: `${loginNameFormat(stream)} in ${section.title}`,
						type: "in",
						requireInteraction: section.is_important || favoriteStreams?.includes?.(stream.user_id),
					};
				});
			} else {
				if (!previousStream) return { ...baseNotis, requireInteraction: favoriteStreams?.includes?.(stream.user_id) };

				const titleUpdated = stream.title !== previousStream.title;
				const gameUpdated = stream.game_name !== previousStream.game_name;

				if (titleUpdated && gameUpdated) {
					return {
						...baseNotis,
						title: `${loginNameFormat(stream)} changed game & title`,
						body: `+ ${truncate(stream.title, 40)}\n- ${truncate(previousStream?.title, 40)}`,
						type: "updated",
					};
				}

				if (titleUpdated) {
					return {
						...baseNotis,
						title: `${loginNameFormat(stream)} changed title`,
						body: `+ ${truncate(stream.title, 40)}\n- ${truncate(previousStream?.title, 40)}`,
						type: "updated",
					};
				}

				if (gameUpdated) {
					return {
						...baseNotis,
						title: `${loginNameFormat(stream)} changed game`,
						body: `+ ${truncate(stream.game_name, 40)}\n- ${truncate(previousStream?.game_name, 40)}`,
						type: "updated",
					};
				}
				return null;
			}
		}, []);

	const offlineNotifications = previouosStreamsWithCurrentStream
		.filter((stream) => {
			return !stream.currentStream;
			// return !stream.currentStream;
		})
		.flatMap((stream) => {
			const feedSections = enabledFeedSections?.filter?.((feedSection: FeedSectionType) => checkAgainstRules(stream, feedSection.rules));
			const duration = durationMsToDate(stream.started_at);

			const baseNotis = {
				title: `${loginNameFormat(stream)} went Offline`,
				icon: stream?.profile_image_url,
				body: `${stream.title || ""}\n${stream.game_name || stream.game || ""}`,
				onClick: (e) => {
					e.preventDefault();
					window.open(`https://aiofeed.com/${loginNameFormat(stream, true)}/page`, stream.user_id);
				},
				stream,
				type: "offline",
			};

			if (feedSections?.length) {
				//If I only wanted to return one notis per stream even if multuple feed sections matched,
				//I could sort feedSections here and just return the first one here
				return feedSections?.map((section: FeedSectionType) => {
					return {
						...baseNotis,
						title: `${loginNameFormat(stream)} went Offline from ${section.title}`,
						body: `Was live for ${duration}`,
					};
				});
			}

			return {
				...baseNotis,
				body: `Was live for ${duration}`,
			};
		});

	return [...liveAndUpdatedNotifications, ...offlineNotifications].filter(Boolean);
};

export default getStreamNotifications;
