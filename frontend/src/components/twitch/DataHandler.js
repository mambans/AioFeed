import React, { useEffect, useState, useRef, useCallback, useContext } from "react";

import ErrorHandeling from "../error/Error";
import getFollowedChannels from "./GetFollowedChannels";
import getFollowedOnlineStreams from "./GetFollowedStreams";
import NotificationsContext from "./../notifications/NotificationsContext";
import styles from "./Twitch.module.scss";
import Utilities from "../../utilities/Utilities";
import Header from "./Header";
import LoadingBoxs from "./LoadingBoxs";
import AccountContext from "./../account/AccountContext";

const REFRESH_RATE = 25; // seconds

export default ({ children }) => {
  const addNotification = useContext(NotificationsContext).addNotification;
  const { twitchUserId, autoRefreshEnabled } = useContext(AccountContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState(20);
  const [refreshing, setRefreshing] = useState(false);
  const followedChannels = useRef([]);
  const liveStreams = useRef([]);
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
            status === "offline"
              ? ""
              : `${Utilities.truncate(stream.title, 60)}\n${stream.game_name}`,
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
      setRefreshing(true);
      try {
        followedChannels.current = await getFollowedChannels(parseInt(twitchUserId));

        if (
          followedChannels.current.data &&
          followedChannels.current.data.data &&
          followedChannels.current.data.data[0]
        ) {
          document.cookie = `Twitch-username=${followedChannels.current.data.data[0].from_name}; path=/`;
        }
        const streams = await getFollowedOnlineStreams(followedChannels.current);

        if (streams.status === 200) {
          setError(null);
          oldLiveStreams.current = liveStreams.current;
          liveStreams.current = streams.data;
          setRefreshing(false);

          if (!disableNotifications) {
            liveStreams.current.forEach(async stream => {
              let isStreamLive = oldLiveStreams.current.find(
                ({ user_name }) => user_name === stream.user_name
              );

              if (!isStreamLive) {
                addSystemNotification("online", stream);

                await addNotification(stream, "Live");

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
              }
            });
          }
        } else if (streams.status === 201) {
          setError(streams.error);
          setRefreshing(false);
        }

        // setRefreshing(false);
        // setIsLoaded(true);
      } catch (error) {
        setError(error);
      }
    },
    [addNotification, addSystemNotification, twitchUserId]
  );

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Remounting Twitch DataHandler.");
        const timeNow = new Date();
        if (!timer.current) {
          await refresh(true);
          setIsLoaded(true);
        }

        if (autoRefreshEnabled && !timer.current) {
          console.log("---Resetting Twitch live interval timer.---");

          // await refresh(true);
          // setIsLoaded(true);

          setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));
          timer.current = setInterval(() => {
            const timeNow = new Date();
            setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));
            refresh();
          }, REFRESH_RATE * 1000);
        } else if (!autoRefreshEnabled && timer.current) {
          clearInterval(timer.current);
          timer.current = null;
          setIsLoaded(true);
          setRefreshing(false);
        }

        // fetchProfileImages(followedChannels.current);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();

    return () => {
      clearInterval(timer.current);
    };
  }, [refresh, autoRefreshEnabled]);

  if (!isLoaded) {
    return (
      <>
        <Header
          data={{
            refreshing: refreshing,
            refreshTimer: refreshTimer,
            followedChannels: followedChannels.current,
          }}
          refresh={refresh}
        />

        <div
          className={styles.container}
          style={{
            marginTop: "0",
          }}>
          <LoadingBoxs amount={5} />
        </div>
      </>
    );
  }
  if (Utilities.getCookie("Twitch-access_token") === null) {
    return (
      <ErrorHandeling
        data={{
          title: "Not authenticated/connected with Twitch.",
          message: "No access token for Twitch available.",
        }}></ErrorHandeling>
    );
  } else {
    return children({
      refreshing: refreshing,
      refreshTimer: refreshTimer,
      followedChannels: followedChannels.current,
      error: error,
      liveStreams: liveStreams.current,
      resetNewlyAddedStreams: resetNewlyAddedStreams,
      refresh: refresh,
      newlyAddedStreams: newlyAddedStreams.current,
      REFRESH_RATE: REFRESH_RATE,
      autoRefreshEnabled: autoRefreshEnabled,
    });
  }
};
