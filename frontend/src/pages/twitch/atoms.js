import { atom, selector } from 'recoil';
import { feedPreferencesAtom } from '../../atoms/atoms';
import { checkAgainstRules } from '../feedSections/FeedSections';

export const feedSectionsAtom = atom({
  key: 'feedSectionsAtom',
  default: [],
});

export const baseLiveStreamsAtom = atom({
  key: 'baseLiveStreamsAtom',
  default: [],
});

export const previousBaseLiveStreamsAtom = atom({
  key: 'previousBaseLiveStreamsAtom',
  default: [],
});

export const newBaseLiveStreamsAtom = selector({
  key: 'newBaseLiveStreamsAtom',
  default: [],
  get: ({ get }) => {
    const baseStreams = get(baseLiveStreamsAtom);
    const basePreviousStreams = get(previousBaseLiveStreamsAtom);

    const newStreams = baseStreams.filter(
      (stream) => !basePreviousStreams?.find((prevStream) => stream.id === prevStream.id)
    );

    return newStreams;
  },
});

export const feedSectionStreamsAtom = atom({
  key: 'feedSectionStreamsAtom',
  default: [],
});
export const nonFeedSectionStreamsAtom = selector({
  key: 'nonFeedSectionStreamsAtom',
  get: ({ get }) => {
    const feedSections = get(feedSectionsAtom);
    const baseLivestreams = get(baseLiveStreamsAtom);
    const feedPreferences = get(feedPreferencesAtom);

    const enabledFeedSections =
      feedPreferences?.feedsections?.enabled &&
      feedSections &&
      Object.values?.(feedSections)?.filter((f = {}) => f.enabled && f.excludeFromTwitch_enabled);

    return baseLivestreams?.filter(
      (stream) => !enabledFeedSections?.some?.(({ rules } = {}) => checkAgainstRules(stream, rules))
    );
  },
  default: [],
});
export const previousNonFeedSectionStreamsAtom = selector({
  key: 'previousNonFeedSectionStreamsAtom',
  get: ({ get }) => {
    const previousBaseStreams = get(previousBaseLiveStreamsAtom);
    const feedSections = get(feedSectionsAtom);

    const enabledFeedSections =
      feedSections &&
      Object.values?.(feedSections)?.filter((f = {}) => f.enabled && f.excludeFromTwitch_enabled);

    return (
      previousBaseStreams?.filter(
        (stream) =>
          !enabledFeedSections?.some?.(({ rules } = {}) => checkAgainstRules(stream, rules))
      ) || []
    );
  },
  default: [],
});
let newInvoked = false;
export const newNonFeedSectionStreamsAtom = selector({
  key: 'newNonFeedSectionStreamsAtom',
  get: ({ get }) => {
    console.log('newInvoked:', newInvoked);
    const previousBaseLiveStreams = get(previousBaseLiveStreamsAtom);
    const nonFeedSectionStreams = get(nonFeedSectionStreamsAtom);
    if (!newInvoked) {
      newInvoked = true;
      return [];
    }

    const newStreams = nonFeedSectionStreams.filter(
      (stream) => !previousBaseLiveStreams?.find((prevStream) => stream.id === prevStream.id)
    );

    console.log('newStreams:', newStreams);
    return newStreams || [];
  },
  default: [],
});

export const newOfflineNonFeedSectionStreamsAtom = selector({
  key: 'newOfflineNonFeedSectionStreamsAtom',
  get: ({ get }) => {
    const previousNonFeedSectionStreams = get(previousNonFeedSectionStreamsAtom);
    const baseLiveStreams = get(baseLiveStreamsAtom);

    const newStreams = previousNonFeedSectionStreams.filter(
      (stream) => !baseLiveStreams?.find((prevStream) => stream.id === prevStream.id)
    );

    return newStreams || [];
  },
  default: [],
});
let newUpdatedInvoked = false;
export const newUpdatedNonFeedSectionStreamsAtom = selector({
  key: 'newUpdatedNonFeedSectionStreamsAtom',
  get: ({ get }) => {
    const previousBaseStreams = get(previousBaseLiveStreamsAtom);
    console.log('previousBaseStreams:', previousBaseStreams);
    const baseStreams = get(baseLiveStreamsAtom);
    if (!newUpdatedInvoked) {
      newUpdatedInvoked = true;
      return [];
    }

    const changedStreams = baseStreams.reduce((acc, stream) => {
      const oldStream = previousBaseStreams?.find((oldStream) => oldStream.id === stream.id);

      if (oldStream && ['game_id', 'title'].some((key) => stream?.[key] !== oldStream?.[key])) {
        return [...acc, { ...stream, oldData: oldStream }];
      }

      return acc;
    }, []);
    console.log('changedStreams:', changedStreams);

    return changedStreams || [];
  },
  default: [],
});

export const twitchFollowedChannelsAtom = atom({
  key: 'TwitchFollowedChannelsAtom',
  default: [],
});
