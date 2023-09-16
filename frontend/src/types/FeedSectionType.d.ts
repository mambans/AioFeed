type FeedSectionType = {
	enabled: boolean;
	UserId: string;
	rules: {
		channel: string;
		viewers: string;
		tag: string;
		id: number;
		title: string;
		category: string;
	}[];
	notifications_enabled: boolean;
	sidebar_enabled: boolean;
	id: number;
	excludeFromTwitch_enabled: boolean;
	title: string;
};
