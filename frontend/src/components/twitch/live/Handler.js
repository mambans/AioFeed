import React, { useEffect, useState, useRef, useCallback, useContext } from "react";

import ErrorHandler from "../../error";
import GetFollowedChannels from "./../GetFollowedChannels";
import getFollowedOnlineStreams from "./GetFollowedStreams";
import NotificationsContext from "./../../notifications/NotificationsContext";
import AccountContext from "./../../account/AccountContext";
import FeedsContext from "./../../feed/FeedsContext";
import VodsContext from "./../vods/VodsContext";
import { AddCookie, getCookie } from "../../../util/Utils";
import LiveStreamsPromise from "./LiveStreamsPromise";
import OfflineStreamsPromise from "./OfflineStreamsPromise";
import UpdatedStreamsPromise from "./UpdatedStreamsPromise";

const REFRESH_RATE = 25; // seconds

export default ({ children }) => {
  const { addNotification, setUnseenNotifications } = useContext(NotificationsContext);
  const { autoRefreshEnabled } = useContext(AccountContext);
  const { setVods } = useContext(VodsContext);
  const {
    enableTwitchVods,
    isEnabledOfflineNotifications,
    isEnabledUpdateNotifications,
  } = useContext(FeedsContext);
  const [refreshTimer, setRefreshTimer] = useState(20);
  const [loadingStates, setLoadingStates] = useState({
    refreshing: false,
    error: null,
    loaded: false,
  });
  const followedChannels = useRef([]);
  const liveStreams = useRef();
  const oldLiveStreams = useRef([]);
  const newlyAddedStreams = useRef([]);
  const timer = useRef();
  const refreshAfterUnfollowTimer = useRef();

  const windowFocusHandler = useCallback(() => {
    document.title = "AioFeed | Feed";
    resetNewlyAddedStreams();
  }, []);

  const windowBlurHandler = useCallback(() => {
    if (document.title !== "AioFeed | Feed") document.title = "AioFeed | Feed";
    resetNewlyAddedStreams();
  }, []);

  useEffect(() => {
    window.addEventListener("focus", windowFocusHandler);
    window.addEventListener("blur", windowBlurHandler);

    return () => {
      window.removeEventListener("focus", windowFocusHandler);
      window.removeEventListener("blur", windowBlurHandler);
    };
  }, [windowBlurHandler, windowFocusHandler]);

  function resetNewlyAddedStreams() {
    newlyAddedStreams.current = [];
  }

  const refresh = useCallback(
    async (disableNotifications = false) => {
      // console.log("refreshing");
      setLoadingStates(({ loaded }) => {
        return { refreshing: true, error: null, loaded: loaded };
      });
      try {
        // followedChannels.current = await getFollowedChannels(parseInt(twitchUserId));
        // followedChannels.current = await GetFollowedChannels();
        followedChannels.current = await GetFollowedChannels();

        if (followedChannels.current && followedChannels.current[0]) {
          AddCookie("Twitch-username", followedChannels.current[0].from_name);
        }
        const streams = await getFollowedOnlineStreams(followedChannels.current);

        if (streams.status === 200) {
          // setError(null);
          oldLiveStreams.current = liveStreams.current;
          liveStreams.current = streams.data;
          setLoadingStates({
            refreshing: false,
            error: null,
            loaded: true,
          });

          if (!disableNotifications) {
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
              const flattenedArray = res.flat(3);
              addNotification(flattenedArray);
            });
          }
        } else if (streams.status === 201) {
          // setError(streams.error);
          setLoadingStates({
            refreshing: false,
            error: streams.error,
            loaded: true,
          });
        }
      } catch (error) {
        // setError(error);
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
          await refresh(true);
          // setIsLoaded(true);
        }

        if (autoRefreshEnabled && !timer.current) {
          console.log("---SetInterval Twitch live timer.---");
          timer.current = setInterval(() => {
            const timeNow = new Date();
            setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));
            refresh();
          }, REFRESH_RATE * 1000);
        } else if (!autoRefreshEnabled && timer.current) {
          clearInterval(timer.current);
          timer.current = null;
          // setIsLoaded(true);
          setLoadingStates({ refreshing: false, loaded: true, error: null });
        }
      } catch (error) {
        // setError(error);
        setLoadingStates({ refreshing: false, error: error, loaded: true });
      }
    })();
  }, [refresh, autoRefreshEnabled]);

  useEffect(() => {
    return () => {
      console.log("Unmounting");
      clearInterval(timer.current);
    };
  }, []);

  if (!getCookie(`Twitch-access_token`)) {
    return (
      <ErrorHandler
        data={{
          title: "Not authenticated/connected with Twitch.",
          message: "No access token for Twitch available.",
        }}
      />
    );
  } else {
    return children({
      refreshing: loadingStates.refreshing,
      loaded: loadingStates.loaded,
      refreshTimer: refreshTimer,
      followedChannels: followedChannels.current,
      error: loadingStates.error,
      liveStreams: liveStreams.current || [],
      resetNewlyAddedStreams: resetNewlyAddedStreams,
      refresh: refresh,
      newlyAddedStreams: newlyAddedStreams.current,
      REFRESH_RATE: REFRESH_RATE,
      autoRefreshEnabled: autoRefreshEnabled,
      refreshAfterUnfollowTimer: refreshAfterUnfollowTimer,
    });
  }
};
