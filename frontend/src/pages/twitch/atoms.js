import { atom } from 'recoil';

export const liveStreamsAtom = atom({
  key: 'liveStreams',
  default: [],
});

export const twitchFollowedChannelsAtom = atom({
  key: 'TwitchFollowedChannels',
  default: [],
});
