import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import _ from 'lodash';

import AlertHandler from '../../alert';
import getMyFollowedChannels from './../getMyFollowedChannels';
import getFollowedOnlineStreams from './GetFollowedStreams';
import NotificationsContext from './../../notifications/NotificationsContext';
import AccountContext from './../../account/AccountContext';
import FeedsContext from './../../feed/FeedsContext';
import VodsContext from './../vods/VodsContext';
import { AddCookie, getCookie, getLocalstorage } from '../../../util/Utils';
import LiveStreamsPromise from './LiveStreamsPromise';
import OfflineStreamsPromise from './OfflineStreamsPromise';
import UpdatedStreamsPromise from './UpdatedStreamsPromise';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';

const REFRESH_RATE = 25; // seconds

export default ({ children }) => {
  const { addNotification, setUnseenNotifications } = useContext(NotificationsContext);
  const { autoRefreshEnabled } = useContext(AccountContext);
  const { setVods } = useContext(VodsContext);
  const {
    enableTwitchVods,
    isEnabledOfflineNotifications,
    isEnabledUpdateNotifications,
    enableForceRefreshThumbnail,
  } = useContext(FeedsContext);
  const [refreshTimer, setRefreshTimer] = useState(20);
  const [loadingStates, setLoadingStates] = useState({
    refreshing: false,
    error: null,
    loaded: false,
  });
  const [thumbnailRefresh, setThumbnailRefresh] = useState();
  const followedChannels = useRef([]);
  const liveStreams = useRef();
  const oldLiveStreams = useRef([]);
  const newlyAddedStreams = useRef([]);
  const timer = useRef();
  const refreshAfterUnfollowTimer = useRef();

  useEventListenerMemo('focus', windowFocusHandler);
  useEventListenerMemo('blur', windowBlurHandler);
  useEventListenerMemo('storage', listener);

  const refresh = useCallback(
    async ({ disableNotifications = false, forceRefreshThumbnails = false } = {}) => {
      setLoadingStates(({ loaded }) => {
        return { refreshing: true, error: null, loaded: loaded };
      });
      try {
        followedChannels.current = await getMyFollowedChannels();

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
          const localStreams = getLocalstorage('newLiveStreamsFromPlayer') || {
            data: [],
            updated: Date.now(),
          };
          const newLiveStreams = [...streams.data, ...localStreams.data];
          const filteredLiveStreams = _.uniqBy(newLiveStreams, 'user_id');

          oldLiveStreams.current = liveStreams.current;
          liveStreams.current = filteredLiveStreams;
          setLoadingStates({
            refreshing: false,
            error: null,
            loaded: true,
          });
          if (forceRefreshThumbnails && enableForceRefreshThumbnail) {
            setThumbnailRefresh(Date.now());
          }

          if (
            !disableNotifications &&
            (liveStreams.current?.length >= 1 || oldLiveStreams.current?.length >= 1)
          ) {
            await Promise.all([
              await LiveStreamsPromise({
                liveStreams,
                oldLiveStreams,
                newlyAddedStreams,
                setUnseenNotifications,
                enableTwitchVods,
                setVods,
              }),

              await OfflineStreamsPromise({
                liveStreams,
                oldLiveStreams,
                isEnabledOfflineNotifications,
                newlyAddedStreams,
                setUnseenNotifications,
                enableTwitchVods,
                setVods,
              }),

              await UpdatedStreamsPromise({
                liveStreams,
                oldLiveStreams,
                newlyAddedStreams,
                setUnseenNotifications,
                isEnabledUpdateNotifications,
              }),
            ]).then((res) => {
              const flattenedArray = res.flat(3).filter((n) => n);
              if (Boolean(flattenedArray?.lengt)) addNotification(flattenedArray);
            });
          }
        } else if (streams?.status === 201) {
          setLoadingStates({
            refreshing: false,
            error: streams.error,
            loaded: true,
          });
        }
      } catch (error) {
        setLoadingStates({
          refreshing: false,
          error: error,
          loaded: true,
        });
      }
    },
    [
      addNotification,
      enableTwitchVods,
      setVods,
      isEnabledUpdateNotifications,
      isEnabledOfflineNotifications,
      setUnseenNotifications,
      enableForceRefreshThumbnail,
    ]
  );

  function windowFocusHandler() {
    document.title = 'AioFeed | Feed';
    resetNewlyAddedStreams();
    if (enableForceRefreshThumbnail) setThumbnailRefresh(Date.now());
  }

  function windowBlurHandler() {
    if (document.title !== 'AioFeed | Feed') document.title = 'AioFeed | Feed';
    resetNewlyAddedStreams();
  }

  function listener(e) {
    if (e.storageArea === localStorage && e.key === 'newLiveStreamsFromPlayer') {
      refresh();
    }
  }

  function resetNewlyAddedStreams() {
    newlyAddedStreams.current = [];
  }

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
          console.log('---SetInterval Twitch live timer.---');
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
      localStorage.setItem(
        'newLiveStreamsFromPlayer',
        JSON.stringify({ data: [], updated: Date.now() })
      );
    };
  }, []);

  if (!getCookie(`Twitch-access_token`)) {
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
    refreshTimer,
    followedChannels: followedChannels.current,
    error: loadingStates.error,
    liveStreams: liveStreams.current || [],
    resetNewlyAddedStreams,
    refresh,
    newlyAddedStreams: newlyAddedStreams.current,
    REFRESH_RATE,
    autoRefreshEnabled,
    refreshAfterUnfollowTimer,
    thumbnailRefresh,
  });
};
