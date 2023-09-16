const findFirstFeedSection = ({
	feedSections,
	streams,
	feedPreferences,
}: {
	feedSections: FeedSectionType[];
	streams?: StreamType[];
	feedPreferences: any;
}) => {
	const firstFeedSection = feedSections.sort((a, b) => (feedPreferences[a.id]?.order || 1000) - (feedPreferences[b.id]?.order || 1000))?.[0];

	return firstFeedSection || null;
};

export default findFirstFeedSection;
