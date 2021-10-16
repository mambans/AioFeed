import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { uniqBy, orderBy } from 'lodash';

import AlertHandler from '../../alert';
import getMyFollowedChannels from './../getMyFollowedChannels';
import getFollowedOnlineStreams from './GetFollowedStreams';
import NotificationsContext from './../../notifications/NotificationsContext';
import FeedsContext from './../../feed/FeedsContext';
import VodsContext from './../vods/VodsContext';
import { AddCookie, getLocalstorage } from '../../../util';
import LiveStreamsPromise from './LiveStreamsPromise';
import OfflineStreamsPromise from './OfflineStreamsPromise';
import UpdatedStreamsPromise from './UpdatedStreamsPromise';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import { TwitchContext } from '../useToken';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const REFRESH_RATE = 25; // seconds

const Handler = ({ children }) => {
  const { addNotification } = useContext(NotificationsContext);
  const {
    autoRefreshEnabled,
    isEnabledOfflineNotifications,
    isEnabledUpdateNotifications,
    twitchAccessToken,
  } = useContext(TwitchContext);
  const { setVods, updateNotischannels } = useContext(VodsContext);
  const { enableTwitchVods } = useContext(FeedsContext) || {};
  const [refreshTimer, setRefreshTimer] = useState(20);
  const [loadingStates, setLoadingStates] = useState({
    refreshing: false,
    error: null,
    loaded: false,
    lastLoaded: false,
  });
  const followedChannels = useRef([]);
  const liveStreams = useRef();
  const oldLiveStreams = useRef([]);
  const [newlyAddedStreams, setNewlyAddedStreams] = useState();
  // const [isInFocus, setIsInFocus] = useState();
  const isInFocus = useRef();
  const timer = useRef();
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
        const filters = getLocalstorage('CustomFilters') || [];
        if (streams?.status === 200) {
          const newLiveStreams = [...(streams?.data || [])];
          const uniqueFilteredLiveStreams = uniqBy(newLiveStreams, 'user_id');

          const rulesFilteredLiveStreams = uniqueFilteredLiveStreams.filter((stream) => {
            const relevantRules =
              filters?.[stream?.login?.toLowerCase() || stream?.user_name?.toLowerCase()];

            if (Boolean(relevantRules?.length)) {
              const whitelists = relevantRules?.some((rule) => rule.action === 'Whitelist');

              return relevantRules?.some((rule) => {
                const match = stream[rule.type?.toLowerCase()]
                  ?.toLowerCase()
                  ?.includes(rule.match.toLowerCase());

                if (!Boolean(stream?.game_id)) return true;
                if (whitelists && !match) return false;
                if (whitelists && match) return true;
                if (match && rule?.action === 'Blacklist') return false;

                return true;
              });
            }
            return true;
          });

          const recentLiveStreams = (liveStreams.current || []).filter(
            (s) => Math.trunc((Date.now() - new Date(s.started_at).getTime()) / 1000) <= 150
          );

          oldLiveStreams.current = liveStreams.current;
          liveStreams.current = orderBy(
            uniqBy([...(rulesFilteredLiveStreams || []), ...(recentLiveStreams || [])], 'id'),
            (s) => s.viewer_count,
            'desc'
          );

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
    ]
  );

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
    liveStreams: liveStreams.current || [],
    refresh,
    newlyAddedStreams: newlyAddedStreams,
    REFRESH_RATE,
    autoRefreshEnabled,
    refreshAfterUnfollowTimer,
  });
};
export default Handler;
