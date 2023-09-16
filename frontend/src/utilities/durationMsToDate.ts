const durationMsToDate = (to, from = null) => {
	const fromDate = from ? new Date(from) : new Date();
	const toDate = new Date(to);

	const diffInMilliseconds = fromDate - toDate;

	if (diffInMilliseconds) {
		const date = new Date(diffInMilliseconds);

		const hours = date.getUTCHours();
		const minutes = date.getUTCMinutes();
		const seconds = date.getUTCSeconds();

		const parts = [];

		if (hours > 0) parts.push(`${hours}h`);
		if (minutes > 0) parts.push(`${minutes}m`);
		if (seconds > 0) parts.push(`${seconds}s`);

		return parts.join(" ");
	}

	return "";
};

export default durationMsToDate;
