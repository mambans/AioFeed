import React, { useEffect, useState, useRef, useCallback } from "react";
import { Spinner } from "react-bootstrap";

import ErrorHandeling from "./../error/Error";
import getFollowedOnlineStreams from "./GetFollowedStreams";
import Utilities from "utilities/Utilities";

// import logo from "./../../assets/images/logo-v2.png";

function HandleData({ children }) {
  const liveStreams = useRef();
  const oldLiveStreams = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState(80);
  const lastRan = useRef(null);
  const newlyAddedStreams = useRef([]);

  function resetNewlyAddedStreams() {
    newlyAddedStreams.current = [];
  }

  const refreshRate = 80; // seconds

  const addSystemNotification = useCallback((status, stream) => {
    if (Notification.permission === "granted") {
      let notification = new Notification(
        `${stream.user_name} ${status === "offline" ? "Offline" : "Live"}`,
        {
          body:
            status === "offline"
              ? ""
              : `${Utilities.truncate(stream.title, 60)}\n${stream.game_name}`,
          icon: stream.profile_img_url || `${process.env.PUBLIC_URL}/icons/v2/Logo2-2k.png`,
          badge: stream.profile_img_url || `${process.env.PUBLIC_URL}/icons/v2/Logo2-2k.png`,
          // icon: stream.profile_img_url || logo,
          // badge: stream.profile_img_url || logo,
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

  const refresh = useCallback(() => {
    async function refetch() {
      try {
        const streams = await getFollowedOnlineStreams(lastRan.current, refreshRate);

        if (streams.status === 200) {
          console.log("Sucessfull refresh!");
          oldLiveStreams.current = liveStreams.current;
          liveStreams.current = streams.data;

          oldLiveStreams.current.forEach(stream => {
            let isStreamLive = liveStreams.current.find(
              ({ user_name }) => user_name === stream.user_name
            );

            if (!isStreamLive) {
              addSystemNotification("offline", stream);
            }
          });

          liveStreams.current.forEach(stream => {
            let isStreamLive = oldLiveStreams.current.find(
              ({ user_name }) => user_name === stream.user_name
            );

            if (!isStreamLive) {
              addSystemNotification("online", stream);
              // setNewlyAdded(true)
              newlyAddedStreams.current.push(stream.user_name);

              stream.newlyAdded = true;

              // document.getElementById(
              //   "favicon16"
              // ).href = `${process.env.PUBLIC_URL}/icons/favicon2Noti-16x16.png`;

              // document.getElementById(
              //   "favicon32"
              // ).href = `${process.env.PUBLIC_URL}/icons/favicon2Noti-32x32.png`;

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

          lastRan.current = new Date();
        } else {
          setError(streams.error);
        }

        setRefreshTimer(streams.refreshTimer + 5);
        setIsLoaded(true);
      } catch (error) {
        setError(error);
      }
    }
    refetch();
  }, [addSystemNotification]);

  useEffect(() => {
    async function fetchData() {
      console.log("fetchData");

      try {
        const streams = await getFollowedOnlineStreams(lastRan.current, refreshRate);

        if (streams.status === 200) {
          liveStreams.current = streams.data;
          lastRan.current = new Date();
        } else {
          setError(streams.error);
        }

        setRefreshTimer(streams.refreshTimer + 5);
        setIsLoaded(true);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();

    const refreshTimerFunc = setInterval(refresh, refreshRate * 1000);

    return () => {
      clearInterval(refreshTimerFunc);
    };
  }, [lastRan, liveStreams, oldLiveStreams, refresh]);

  if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else if (!isLoaded) {
    return (
      <Spinner animation='border' role='status' style={Utilities.loadingSpinner}>
        <span className='sr-only'>Loading...</span>
      </Spinner>
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
    });
  }
}

export default HandleData;
