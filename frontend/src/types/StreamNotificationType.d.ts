type StreamNotificationType = {
	title: string;
	body: string;
	icon: string;
	onClick: () => void;
	stream: StreamType;
	type: "in" | "updated" | "offline" | "live";
};
