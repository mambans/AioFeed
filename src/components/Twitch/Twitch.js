import React, { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

import Utilities from "utilities/utilities";
import ErrorHandeling from "./../Error/Error";

import styles from "./Twitch.module.scss";
import RenderTwitch from "./Render-Twitch";

import getFollowedOnlineStreams from "./getFollowedStreams";

function Twitch() {
  const [liveStreams, setLiveStreams] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(null);

  const lastRan = useRef(null);

  const windowFocusHandler = useCallback(() => {
    async function fetchData() {
      try {
        setRefreshing(true);
        const streams = await getFollowedOnlineStreams(lastRan.current);

        if (streams !== 401) {
          console.log(streams);

          setLiveStreams(streams);
          lastRan.current = new Date();
        }
        setRefreshing(false);
      } catch (error) {
        setError(error);
      }
    }
    fetchData();
  }, []);

  const windowBlurHandler = useCallback(() => {
    console.log("Focus lost");
  }, []);

  useEffect(() => {
    window.addEventListener("focus", windowFocusHandler);
    window.addEventListener("blur", windowBlurHandler);
    setRefreshing(true);

    async function fetchData() {
      try {
        const streams = await getFollowedOnlineStreams(lastRan.current);

        setLiveStreams(streams);
        setIsLoaded(true);
        setRefreshing(false);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();
    lastRan.current = new Date();

    return () => {
      window.removeEventListener("blur", windowBlurHandler);
      window.removeEventListener("focus", windowFocusHandler);
    };
  }, [lastRan, windowBlurHandler, windowFocusHandler]);

  if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else if (!isLoaded) {
    return (
      <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  } else {
    console.log("Render liveStreams: ", liveStreams);
    return (
      <>
        <Button
          variant="outline-secondary"
          className={styles.refreshButton}
          onClick={windowFocusHandler}>
          Reload
        </Button>
        {refreshing ? (
          <Spinner animation="border" role="status" style={Utilities.loadingSpinnerSmall}></Spinner>
        ) : null}
        <div className={styles.container}>
          {liveStreams.map(stream => {
            return <RenderTwitch data={stream} key={stream.id} />;
          })}
        </div>
      </>
    );
  }
}

export default Twitch;
