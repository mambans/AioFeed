import React, { useEffect, useState, useRef, useCallback } from "react";
import { Spinner } from "react-bootstrap";
import Icon from "react-icons-kit";
import { twitch } from "react-icons-kit/fa/twitch";

import ErrorHandeling from "../error/Error";
import getFollowedOnlineStreams from "./GetFollowedStreams";
import Utilities from "../../utilities/Utilities";
import styles from "./Twitch.module.scss";

const REFRESH_RATE = 30; // seconds

function HandleData({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState();
  const [refreshing, setRefreshing] = useState(false);
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
          icon: stream.profile_img_url || `${process.env.PUBLIC_URL}/icons/v3/Logo-2k.png`,
          badge: stream.profile_img_url || `${process.env.PUBLIC_URL}/icons/v3/Logo-2k.png`,
          silent: status === "offline" ? true : false,
        }
      );

      notification.onclick = function(event) {
        event.preventDefault(); // prevent the browser from focusing the Notification's tab
        status === "offline"
          ? window.open(
              "https://www.twitch.tv/" + stream.user_name.toLowerCase() + "/videos",
              "_blank"
            )
          : window.open("https://www.twitch.tv/" + stream.user_name.toLowerCase(), "_blank");
      };

      return notification;
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setError(null);
      const streams = await getFollowedOnlineStreams();

      if (streams.status === 200) {
        oldLiveStreams.current = liveStreams.current;
        liveStreams.current = streams.data;
        setRefreshing(false);

        oldLiveStreams.current.forEach(stream => {
          let isStreamLive = liveStreams.current.find(
            ({ user_name }) => user_name === stream.user_name
          );

          if (!isStreamLive) addSystemNotification("offline", stream);
        });

        liveStreams.current.forEach(stream => {
          let isStreamLive = oldLiveStreams.current.find(
            ({ user_name }) => user_name === stream.user_name
          );

          if (!isStreamLive) {
            addSystemNotification("online", stream);
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
      } else if (streams.status === 201) {
        // console.log("-201-");
        setRefreshing(false);
      }

      setRefreshing(false);
      setIsLoaded(true);
    } catch (error) {
      setError(error);
    }
  }, [addSystemNotification]);

  useEffect(() => {
    async function fetchData() {
      try {
        const timeNow = new Date();
        setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));

        timer.current = setInterval(() => {
          const timeNow = new Date();
          setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));
          refresh();
        }, REFRESH_RATE * 1000);
        const streams = await getFollowedOnlineStreams();
        if (streams.status === 200) {
          liveStreams.current = streams.data;
        } else {
          setError(streams.error);
        }

        setIsLoaded(true);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();

    return () => {};
  }, [liveStreams, oldLiveStreams, refresh]);

  useEffect(() => {
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  if (!isLoaded) {
    return (
      <>
        <div className={styles.header_div} style={{ marginTop: "120px" }}>
          <h4 className={styles.container_header}>
            Twitch Live <Icon icon={twitch} size={32} style={{ paddingLeft: "10px" }}></Icon>
          </h4>
        </div>
        <Spinner animation='grow' role='status' style={Utilities.loadingSpinner} variant='light'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      </>
    );
  } else if (!Utilities.getCookie("Twitch-access_token")) {
    return (
      <ErrorHandeling
        data={{
          title: "Couldn't load Twitch feed",
          message: "You are not connected with your Twitch account to Notifies",
        }}></ErrorHandeling>
    );
  } else {
    return children({
      liveStreams: liveStreams.current,
      refresh: refresh,
      refreshTimer: refreshTimer,
      newlyAddedStreams: newlyAddedStreams.current,
      resetNewlyAddedStreams: resetNewlyAddedStreams,
      error: error,
      timer: timer.current,
      refreshing: refreshing,
      REFRESH_RATE: REFRESH_RATE,
      setRefreshTimer: setRefreshTimer,
    });
  }
}

export default HandleData;
