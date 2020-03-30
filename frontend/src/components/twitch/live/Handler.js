import React, { useEffect, useState, useRef, useCallback, useContext } from "react";

import ErrorHandler from "../../error";
import getFollowedChannels from "./../GetFollowedChannels";
import getFollowedOnlineStreams from "./GetFollowedStreams";
import NotificationsContext from "./../../notifications/NotificationsContext";
import Util from "../../../util/Util";
import Header from "./Header";
import LoadingBoxs from "./../LoadingBoxs";
import AccountContext from "./../../account/AccountContext";
import FeedsContext from "./../../feed/FeedsContext";
import VodsContext from "./../vods/VodsContext";
import FetchSingelChannelVods from "./../vods/FetchSingelChannelVods";
import { Container } from "../StyledComponents";
import LoadingSidebar from "../sidebar/LoadingSidebar";

const REFRESH_RATE = 25; // seconds

export default ({ children }) => {
  const addNotification = useContext(NotificationsContext).addNotification;
  const { twitchUserId, autoRefreshEnabled, twitchToken } = useContext(AccountContext);
  const { setVods, channels } = useContext(VodsContext);
  const { enableTwitchVods } = useContext(FeedsContext);
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [error, setError] = useState(null);
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

  function resetNewlyAddedStreams() {
    newlyAddedStreams.current = [];
  }

  const addSystemNotification = useCallback((status, stream) => {
    if (Notification.permission === "granted") {
      let notification = new Notification(
        `${stream.user_name} ${status === "offline" ? "Offline" : "Live"}`,
        {
          body:
            status === "offline" ? "" : `${Util.truncate(stream.title, 60)}\n${stream.game_name}`,
          icon: stream.profile_img_url || `${process.env.PUBLIC_URL}/android-chrome-512x512.png`,
          badge: stream.profile_img_url || `${process.env.PUBLIC_URL}/android-chrome-512x512.png`,
          silent: status === "offline" ? true : false,
        }
      );

      notification.onclick = function(event) {
        event.preventDefault(); // prevent the browser from focusing the Notification's tab
        status === "offline"
          ? window.open(
              "https://www.twitch.tv/" + stream.user_name.toLowerCase() + "/videos/" + stream.id,
              "_blank"
            )
          : window.open("https://www.twitch.tv/" + stream.user_name.toLowerCase(), "_blank");
      };

      return notification;
    }
  }, []);

  const refresh = useCallback(
    async disableNotifications => {
      // console.log("refreshing");
      setLoadingStates(({ loaded }) => {
        return { refreshing: true, error: null, loaded: loaded };
      });
      try {
        followedChannels.current = await getFollowedChannels(parseInt(twitchUserId));

        if (followedChannels.current && followedChannels.current[0]) {
          document.cookie = `Twitch-username=${followedChannels.current[0].from_name}; path=/; SameSite=Lax`;
        }
        const streams = await getFollowedOnlineStreams(followedChannels.current);

        if (streams.status === 200) {
          // setError(null);
          oldLiveStreams.current = liveStreams.current;
          liveStreams.current = streams.data;
          setLoadingStates({ refreshing: false, error: null, loaded: true });

          if (!disableNotifications) {
            liveStreams.current.forEach(stream => {
              let isStreamLive = oldLiveStreams.current.find(
                ({ user_name }) => user_name === stream.user_name
              );

              if (!isStreamLive) {
                addSystemNotification("online", stream);

                addNotification(stream, "Live");

                console.log(`${stream.user_name} went online - array: `, channels);

                if (
                  enableTwitchVods &&
                  JSON.parse(localStorage.getItem("VodChannels")).includes(
                    stream.user_name.toLowerCase()
                  )
                ) {
                  setTimeout(async () => {
                    console.log("Fetching", stream.user_name, "live vod");
                    await FetchSingelChannelVods(stream.user_id, setVods);
                  }, 30000);
                }

                newlyAddedStreams.current.push(stream.user_name);
                stream.newlyAdded = true;

                if (document.title.length > 15) {
                  const title = document.title.substring(4);
                  const count = parseInt(document.title.substring(1, 2)) + 1;
                  document.title = `(${count}) ${title}`;
                } else {
                  const title = document.title;
                  document.title = `(${1}) ${title}`;
                }
              }
            });

            oldLiveStreams.current.forEach(stream => {
              let isStreamLive = liveStreams.current.find(
                ({ user_name }) => user_name === stream.user_name
              );
              if (!isStreamLive) {
                // console.log(stream.user_name, "went Offline.");
                addNotification(stream, "Offline");

                console.log(`${stream.user_name} went offline - array: `, channels);

                if (
                  enableTwitchVods &&
                  JSON.parse(localStorage.getItem("VodChannels")).includes(
                    stream.user_name.toLowerCase()
                  )
                ) {
                  setTimeout(async () => {
                    console.log("Fetching", stream.user_name, "offline vod");
                    await FetchSingelChannelVods(stream.user_id, setVods);
                  }, 0);
                }
              }
            });
          }
        } else if (streams.status === 201) {
          // setError(streams.error);
          setLoadingStates({ refreshing: false, error: streams.error, loaded: true });
        }
      } catch (error) {
        // setError(error);
        setLoadingStates({ refreshing: false, error: error, loaded: true });
      }
    },
    [addNotification, addSystemNotification, twitchUserId, channels, enableTwitchVods, setVods]
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

  if (!loadingStates.loaded) {
    // if (true) {
    return (
      <>
        <Header
          data={{
            refreshing: loadingStates.refreshing,
            refreshTimer: refreshTimer,
            followedChannels: followedChannels.current,
          }}
          refresh={refresh}
        />
        <LoadingSidebar />
        <Container>
          <LoadingBoxs amount={5} />
        </Container>
      </>
    );
  }
  if (!twitchToken) {
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
      refreshTimer: refreshTimer,
      followedChannels: followedChannels.current,
      error: loadingStates.error,
      liveStreams: liveStreams.current || [],
      resetNewlyAddedStreams: resetNewlyAddedStreams,
      refresh: refresh,
      newlyAddedStreams: newlyAddedStreams.current,
      REFRESH_RATE: REFRESH_RATE,
      autoRefreshEnabled: autoRefreshEnabled,
    });
  }
};
