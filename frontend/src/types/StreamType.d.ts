interface StreamType extends BaseStream {
	game_img: string;
	profile_image_url: string;
	login: string;

	view_count: number;

	game: string;
	game_name: string;
	thumbnail_url: string;
	title: string;
	user_name?: string;
	user_id: string;
	started_at?: string;
	ended_at?: string;

	// [key: string]: any;
}
