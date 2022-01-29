import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { uniqBy, orderBy } from 'lodash';

import AlertHandler from '../../../components/alert';
import getMyFollowedChannels from './../getMyFollowedChannels';
import getFollowedOnlineStreams from './GetFollowedStreams';
import NotificationsContext from './../../notifications/NotificationsContext';
import FeedsContext from './../../feed/FeedsContext';
import VodsContext from './../vods/VodsContext';
import { AddCookie } from '../../../util';
import LiveStreamsPromise from './LiveStreamsPromise';
import OfflineStreamsPromise from './OfflineStreamsPromise';
import UpdatedStreamsPromise from './UpdatedStreamsPromise';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import { TwitchContext } from '../useToken';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { fetchAndAddTags } from '../fetchAndAddTags';
import FeedSectionsContext from '../../feedSections/FeedSectionsContext';
import { checkAgainstRules } from '../../feedSections/FeedSections';

const REFRESH_RATE = 25; // seconds

const Handler = ({ children }) => {
  const { addNotification } = useContext(NotificationsContext);
  const {
    autoRefreshEnabled,
    isEnabledOfflineNotifications,
    isEnabledUpdateNotifications,
    twitchAccessToken,
    updateNotischannels,
  } = useContext(TwitchContext);
  const { setVods } = useContext(VodsContext);
  const { enableTwitchVods } = useContext(FeedsContext) || {};
  const { feedSections } = useContext(FeedSectionsContext) || {};
  const [refreshTimer, setRefreshTimer] = useState(20);
  const [loadingStates, setLoadingStates] = useState({
    refreshing: false,
    error: null,
    loaded: false,
    lastLoaded: false,
  });
  const followedChannels = useRef([]);
  const liveStreams = useRef();
  const nonFeedSectionLiveStreams = useRef();
  const oldLiveStreams = useRef([]);
  const [newlyAddedStreams, setNewlyAddedStreams] = useState();
  // const [isInFocus, setIsInFocus] = useState();
  const isInFocus = useRef();
  const timer = useRef();
  const streamTags = useRef([]);
  const refreshAfterUnfollowTimer = useRef();
  // eslint-disable-next-line no-unused-vars
  const [documentTitle, setDocumentTitle] = useDocumentTitle(
    newlyAddedStreams ? `(${newlyAddedStreams?.length}) Feed` : 'Feed'
  );
  const windowFocusHandler = () => (isInFocus.current = true);
  const windowBlurHandler = () => !autoRefreshEnabled && setNewlyAddedStreams([]);
  useEventListenerMemo('focus', windowFocusHandler, document);
  useEventListenerMemo('blur', windowBlurHandler);

  const refresh = useCallback(
    async ({
      disableNotifications = false,
      forceRefreshThumbnails = false,
      forceValidateToken = false,
    } = {}) => {
      setLoadingStates(({ loaded, lastLoaded }) => {
        return { refreshing: true, error: null, loaded: loaded, lastLoaded: lastLoaded };
      });
      try {
        if (isInFocus.current) setNewlyAddedStreams([]);
        isInFocus.current = false;
        followedChannels.current = await getMyFollowedChannels(forceValidateToken);

        if (followedChannels.current && followedChannels.current[0]) {
          AddCookie('Twitch-username', followedChannels.current[0].from_name);
        }
        const streams =
          Array.isArray(followedChannels.current) &&
          (await getFollowedOnlineStreams({
            followedchannels: followedChannels.current,
            disableNotifications: disableNotifications,
            previousStreams: oldLiveStreams.current,
          }));
        if (streams?.status === 200) {
          const newLiveStreams = [...(streams?.data || [])];
          const uniqueFilteredLiveStreams = uniqBy(newLiveStreams, 'user_id');
          const streamsTag_ids = uniqueFilteredLiveStreams.reduce((acc, curr) => {
            return [...acc, ...(curr?.tag_ids || [])];
          }, []);
          const tag_ids = streamsTag_ids.filter(
            (tag) => !streamTags.current.find(({ tag_id } = {}) => tag_id === tag)
          );
          const uniqueTags = [...new Set(tag_ids)];

          const fetchedStreamTags = uniqueTags?.length
            ? await fetchAndAddTags({
                tag_ids: uniqueTags,
              })
            : [];
          const tags = uniqBy(
            [...(streamTags.current || []), ...(fetchedStreamTags || [])],
            'tag_id'
          );
          streamTags.current = tags;

          const recentLiveStreams = (uniqueFilteredLiveStreams || []).filter(
            (s = {}) => Math.trunc((Date.now() - new Date(s?.started_at).getTime()) / 1000) <= 150
          );

          oldLiveStreams.current = liveStreams.current;
          const uniqueStreams = uniqBy(
            [...(uniqueFilteredLiveStreams || []), ...(recentLiveStreams || [])],
            'id'
          );

          const streamsWithTags = uniqueStreams?.map((stream = {}) => {
            const streams_tags = stream?.tag_ids?.map((id) => {
              return tags?.find(({ tag_id } = {}) => tag_id === id);
            });
            const tag_names = streams_tags?.map((tag) => tag?.localization_names?.['en-us']);

            return { ...stream, tag_names, tags: streams_tags };
          });

          const enabledFeedSections =
            feedSections &&
            Object.values?.(feedSections)?.filter(
              (f = {}) => f.enabled && f.excludeFromTwitch_enabled
            );

          const orderedStreams = orderBy(streamsWithTags, (s) => s.viewer_count, 'desc');

          await Promise.resolve(
            (() => {
              liveStreams.current = orderedStreams;
              nonFeedSectionLiveStreams.current = orderedStreams?.filter(
                (stream) =>
                  !enabledFeedSections?.some(({ rules } = {}) => checkAgainstRules(stream, rules))
              );

              return { liveStreams, nonFeedSectionLiveStreams };
            })()
          ).then((res) => {
            setTimeout(async () => {
              console.log('res:', res);
              setLoadingStates({
                refreshing: false,
                error: null,
                loaded: true,
                lastLoaded: Date.now(),
              });
              if (
                !disableNotifications &&
                (liveStreams.current?.length >= 1 || oldLiveStreams.current?.length >= 1)
              ) {
                await Promise.all([
                  await LiveStreamsPromise({
                    liveStreams,
                    oldLiveStreams,
                    enableTwitchVods,
                    setVods,
                    setNewlyAddedStreams,
                  }),

                  await OfflineStreamsPromise({
                    liveStreams,
                    oldLiveStreams,
                    isEnabledOfflineNotifications,
                    enableTwitchVods,
                    setVods,
                  }),

                  await UpdatedStreamsPromise({
                    liveStreams,
                    oldLiveStreams,
                    isEnabledUpdateNotifications,
                    updateNotischannels,
                  }),
                ]).then((res) => {
                  const flattenedArray = res.flat(3).filter((n) => n);
                  if (Boolean(flattenedArray?.length)) addNotification(flattenedArray);
                });
              }
            }, 0);
          });
        } else if (streams?.status === 201) {
          setLoadingStates({
            refreshing: false,
            error: streams.error,
            loaded: true,
            lastLoaded: Date.now(),
          });
        }
      } catch (error) {
        setLoadingStates({
          refreshing: false,
          error: error,
          loaded: true,
          lastLoaded: Date.now(),
        });
      }
    },
    [
      addNotification,
      enableTwitchVods,
      setVods,
      isEnabledUpdateNotifications,
      isEnabledOfflineNotifications,
      updateNotischannels,
      setNewlyAddedStreams,
      feedSections,
    ]
  );

  useEffect(() => {
    if (liveStreams?.current?.length) {
      console.log(1);
      const enabledFeedSections =
        feedSections &&
        Object.values?.(feedSections)?.filter((f = {}) => f.enabled && f.excludeFromTwitch_enabled);

      nonFeedSectionLiveStreams.current = orderBy(
        liveStreams.current,
        (s) => s?.viewer_count,
        'desc'
      )?.filter(
        (stream) => !enabledFeedSections?.some(({ rules } = {}) => checkAgainstRules(stream, rules))
      );
    }
  }, [feedSections]);

  useEffect(() => {
    (async () => {
      try {
        const timeNow = new Date();
        if (!timer.current) {
          if (autoRefreshEnabled) {
            setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));
          }
          await refresh({ disableNotifications: true });
        }

        if (autoRefreshEnabled && !timer.current) {
          timer.current = setInterval(() => {
            const timeNow = new Date();
            setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));
            refresh();
          }, REFRESH_RATE * 1000);
        } else if (!autoRefreshEnabled && timer.current) {
          clearInterval(timer.current);
          timer.current = null;
          setLoadingStates({ refreshing: false, loaded: true, error: null });
        }
      } catch (error) {
        setLoadingStates({ refreshing: false, error: error, loaded: true });
      }
    })();
  }, [refresh, autoRefreshEnabled]);

  useEffect(() => {
    return () => {
      console.log('Unmounting');
      clearInterval(timer.current);
    };
  }, []);

  if (!twitchAccessToken) {
    return (
      <AlertHandler
        title='Not authenticated/connected with Twitch.'
        message='No access token for Twitch available.'
      />
    );
  }
  return children({
    refreshing: loadingStates.refreshing,
    loaded: loadingStates.loaded,
    lastLoaded: loadingStates.lastLoaded,
    refreshTimer,
    followedChannels: followedChannels.current,
    error: loadingStates.error,
    oldLiveStreams: oldLiveStreams.current || [],
    liveStreams: liveStreams.current || [],
    nonFeedSectionLiveStreams: nonFeedSectionLiveStreams.current || [],
    refresh,
    newlyAddedStreams: newlyAddedStreams,
    REFRESH_RATE,
    autoRefreshEnabled,
    refreshAfterUnfollowTimer,
  });
};
export default Handler;
