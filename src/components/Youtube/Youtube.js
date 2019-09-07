import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";
import Moment from "react-moment";

import getFollowChannels from "./getFollowedChannels";
import getSubscriptionVideos from "./getSubscriptionVideos";
import RenderYoutube from "./Render-Youtube";
import styles from "./Youtube.module.scss";

import Utilities from "utilities/utilities";
import ErrorHandeling from "./../Error/Error";

function Youtube() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState(null);
  const [refreshing, setRefreshing] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const followedChannels = useRef();

  const refresh = useCallback(() => {
    async function fetchData() {
      try {
        setRefreshing(true);
        followedChannels.current = await getFollowChannels();

        const SubscriptionVideos = await getSubscriptionVideos(followedChannels.current);

        setVideos(SubscriptionVideos);
        setLastRefresh(new Date());
        setIsLoaded(true);
        setRefreshing(false);
      } catch (error) {
        setRefreshing(false);
        setError(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setRefreshing(true);
        followedChannels.current = await getFollowChannels();

        const SubscriptionVideos = await getSubscriptionVideos(followedChannels.current);

        setVideos(SubscriptionVideos);
        setLastRefresh(new Date());
        setIsLoaded(true);
        setRefreshing(false);
      } catch (error) {
        setRefreshing(false);
        setError(error);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else if (!isLoaded) {
    return (
      <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  } else {
    console.log("Render Youtube videos: ", videos);
    return (
      <>
        <Button variant="outline-secondary" className={styles.refreshButton} onClick={refresh}>
          Reload
        </Button>
        {refreshing ? (
          <Spinner animation="border" role="status" style={Utilities.loadingSpinnerSmall}></Spinner>
        ) : (
          <Moment key={lastRefresh.getTime()} className={styles.lastRefresh} fromNow>
            {lastRefresh}
          </Moment>
        )}
        <div className={styles.container}>
          {videos.map(video => {
            return <RenderYoutube data={video} key={video.contentDetails.upload.videoId} />;
          })}
        </div>
      </>
    );
  }
}

export default Youtube;
