declare module "twitch-api" {
	export interface TwitchAPI {
		getFollowedStreams: (options: { user_id: string; first: number; signal: AbortSignal }) => Promise<any>;
	}

	export const pagination: (response: any) => Promise<any>;
}
