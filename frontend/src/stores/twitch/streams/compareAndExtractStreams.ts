const compareAndExtractStreams = (streams: StreamType[], previousStreams: StreamType[]) => {
	const livestreams = [] as StreamType[];
	const newlyAddedStreams = [] as StreamType[];

	streams.forEach((stream: StreamType) => {
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
