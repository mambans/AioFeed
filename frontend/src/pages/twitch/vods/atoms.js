import { atom } from 'recoil';
import { localStorageEffect } from '../../../atoms/effects';
import { getLocalstorage } from '../../../util';

export const vodChannelsAtom = atom({
  key: 'vodChannelsAtom',
  default: getLocalstorage('TwitchVods-Channels') || [],
  effects: [localStorageEffect('TwitchVods-Channels')],
});
export const twitchVodsEnabledAtom = atom({
  key: 'twitchVodsEnabledAtom',
  default: false,
});

export const twitchVodsAtom = atom({
  key: 'twitchVodsAtom',
  default: getLocalstorage('TwitchVods') || [],
  effects: [localStorageEffect('TwitchVods')],
});
