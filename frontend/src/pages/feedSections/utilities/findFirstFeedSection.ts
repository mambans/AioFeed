const findFirstFeedSection = ({ feedSections, streams, feedPreferences }) => {
	const firstFeedSection = feedSections.sort((a, b) => (feedPreferences[a]?.order || 1000) - (feedPreferences[b]?.order || 1000))?.[0];

	return firstFeedSection || null;
};

export default findFirstFeedSection;
