const compareAndExtractStreams = (streams: StreamType[], previousStreams: StreamType[]) => {
	const livestreams = [];
	const newlyAddedStreams = [];

	streams.forEach((stream) => {
		const previousStream = previousStreams.find((previousStream) => previousStream.id === stream.id);

		if (previousStream) {
			livestreams.push(stream);
		} else {
			newlyAddedStreams.push(stream);
		}
	});

	return { livestreams, newlyAddedStreams };
};

export default compareAndExtractStreams;
