import React, { useEffect, useState, useRef, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";

import ErrorHandeling from "./../error/Error";
import getFollowedOnlineStreams from "./GetFollowedStreams";
import RenderTwitch from "./Render-Twitch";
import styles from "./Twitch.module.scss";
import Utilities from "utilities/Utilities";

import logo from "./../../assets/images/logo-v2.png";

function Twitch() {
  const [liveStreams, setLiveStreams] = useState();
  const oldLiveStreams = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState(80);
  const [renderTimer, setRenderTimer] = useState();
  const initialOpen = useRef(true);

  const refreshRate = 20; // seconds

  function onChange(newRun) {
    initialOpen.current = newRun;
  }

  const lastRan = useRef(null);

  const refresh = useCallback(() => {
    async function refetch() {
      console.log("refresh");

      try {
        setRefreshing(true);
        const streams = await getFollowedOnlineStreams(lastRan.current, refreshRate);

        if (streams.status === 200) {
          console.log("Sucessfull refresh!");

          oldLiveStreams.current = liveStreams && liveStreams.data;
          console.log("TCL: refetch -> oldLiveStreams.current", oldLiveStreams.current);

          setLiveStreams(streams.data);
          console.log("steads: ", liveStreams);

          lastRan.current = new Date();
        } else {
          setError(streams.error);
        }

        setRefreshTimer(streams.refreshTimer + 5);
        setIsLoaded(true);
        setRefreshing(false);
      } catch (error) {
        setError(error);
      }
    }
    refetch();
  }, [liveStreams]);

  const windowFocusHandler = useCallback(() => {
    document.title = "Notifies | Feed";

    refresh();
  }, [refresh]);

  const windowBlurHandler = useCallback(() => {}, []);

  const addSystemNotification = useCallback((status, stream) => {
    if (Notification.permission === "granted") {
      let notification = new Notification(
        `${stream.user_name} ${status === "offline" ? "Offline" : "Live"}`,
        {
          body:
            status === "offline"
              ? ""
              : `${Utilities.truncate(stream.title, 60)}\n${stream.game_name}`,
          icon: stream.profile_img_url || logo,
          badge: stream.profile_img_url || logo,
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

  useEffect(() => {
    setRefreshing(true);
    console.log("liveStreams: ", liveStreams);

    async function fetchData() {
      try {
        setRefreshing(true);
        const streams = await getFollowedOnlineStreams(lastRan.current, refreshRate);

        if (streams.status === 200) {
          setLiveStreams(streams.data);
          lastRan.current = new Date();
        } else {
          setError(streams.error);
        }

        setRefreshTimer(streams.refreshTimer + 5);
        setIsLoaded(true);
        setRefreshing(false);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();
    window.addEventListener("focus", windowFocusHandler);
    window.addEventListener("blur", windowBlurHandler);

    const refreshTimerFunc = setInterval(refresh, refreshRate * 1000);

    return () => {
      console.log("liveStreams22: ", liveStreams);
      if (liveStreams !== undefined) {
        sessionStorage.setItem(`livestreamData`, JSON.stringify(liveStreams));
      }

      clearInterval(refreshTimerFunc);
      window.removeEventListener("blur", windowBlurHandler);
      window.removeEventListener("focus", windowFocusHandler);
    };
  }, [
    lastRan,
    liveStreams,
    oldLiveStreams,
    refresh,
    renderTimer,
    windowBlurHandler,
    windowFocusHandler,
  ]);

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
    return (
      <>
        <div
          className={styles.header_div}
          style={{
            marginTop: "0",
          }}>
          <Button variant='outline-secondary' className={styles.refreshButton} onClick={refresh}>
            Reload
          </Button>
          {refreshing ? (
            <Spinner
              animation='border'
              role='status'
              style={Utilities.loadingSpinnerSmall}></Spinner>
          ) : (
            <p key={refreshTimer} className={styles.refreshTimer}>
              {Math.trunc(refreshTimer) >= 0
                ? `in ${Math.trunc(refreshTimer)} seconds`
                : "recently refreshed"}
            </p>
          )}
          <h4 className={styles.container_header}>Twitch</h4>
        </div>
        <div className={styles.container}>
          {liveStreams.map(stream => {
            // console.log("s: ", stream);
            // runNotification(stream);
            // addSystemNotification("offline", stream);

            return (
              <RenderTwitch
                data={stream}
                run={{ initial: initialOpen.current }}
                runChange={onChange}
                key={stream.id}
              />
            );
          })}
        </div>
      </>
    );
  }
}

export default Twitch;
