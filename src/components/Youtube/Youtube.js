import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";
import Moment from "react-moment";
import Alert from "react-bootstrap/Alert";

import getFollowedChannels from "./GetFollowedChannels";
import getSubscriptionVideos from "./GetSubscriptionVideos";
import RenderYoutube from "./Render-Youtube";
import styles from "./Youtube.module.scss";

import Utilities from "utilities/Utilities";
import ErrorHandeling from "./../error/Error";

function Youtube() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState(null);
  const [refreshing, setRefreshing] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [requestError, setRequestError] = useState();

  const followedChannels = useRef();

  const refresh = useCallback(() => {
    async function fetchData() {
      try {
        setRefreshing(true);
        followedChannels.current = await getFollowedChannels();

        const SubscriptionData = await getSubscriptionVideos(followedChannels.current);

        const SubscriptionVideos = SubscriptionData.data;

        setRequestError(SubscriptionData.error.response.data.error);
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
        followedChannels.current = await getFollowedChannels();

        const SubscriptionData = await getSubscriptionVideos(followedChannels.current);

        const SubscriptionVideos = SubscriptionData.data;

        // const SubscriptionVideos = await getSubscriptionVideos(followedChannels.current);
        setRequestError(SubscriptionData.error.response.data.error);
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
        {requestError && requestError.code === 403 ? (
          // <p className={styles.requestError}>{requestError.response.data.error.errors[0].reason}</p>
          <Alert
            key={requestError.errors[0].reason}
            className={styles.requestError}
            variant={"warning"}>
            {requestError.errors[0].reason}
          </Alert>
        ) : null}
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
