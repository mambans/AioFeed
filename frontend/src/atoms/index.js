import { atom } from 'recoil';

export const userAtom = atom({
  key: 'user', // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export const userLoadingAtom = atom({
  key: 'userLoading', // unique ID (with respect to other atoms/selectors)
  default: true, // default value (aka initial value)
});

export const vodChannelsAtom = atom({
  key: 'vodChannels',
  default: null,
});

// export const vodChannelsSelector = selector({
//   key: 'vodChannelsSelector', // unique ID (with respect to other atoms/selectors)
//   default: [], // default value (aka initial value)
//   get: async () => {
//     return await API.getVodChannels();
//   },
//   set: ({ set }, newValue) => set(vodChannelsSelector, newValue),
// });
