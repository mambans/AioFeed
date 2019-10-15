import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";
import Moment from "react-moment";
import Alert from "react-bootstrap/Alert";
import LazyLoad from "react-lazyload";
import Icon from "react-icons-kit";
import { reload } from "react-icons-kit/iconic/reload";

import getFollowedChannels from "./GetFollowedChannels";
import getSubscriptionVideos from "./GetSubscriptionVideos";
import RenderYoutube from "./Render-Youtube";
import styles from "./Youtube.module.scss";
import Utilities from "utilities/Utilities";
import ErrorHandeling from "../error/Error";

function Youtube() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState(null);
  const [refreshing, setRefreshing] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [requestError, setRequestError] = useState();
  const followedChannels = useRef();
  const initialOpen = useRef(true);

  function onChange(newRun) {
    initialOpen.current = newRun;
  }

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
      <>
        <div className={styles.header_div}>
          <h4 className={styles.container_header}>Youtube</h4>
        </div>
        <Spinner animation='grow' role='status' style={Utilities.loadingSpinner} variant='light'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      </>
    );
  } else if (
    Utilities.getCookie("Youtube-access_token") === null ||
    Utilities.getCookie("Youtube-access_token") === "null"
  ) {
    return (
      <ErrorHandeling
        data={{
          title: "Couldn't load Youtube feed",
          message: "You are not connected with your Youtube account to Notifies",
        }}></ErrorHandeling>
    );
  } else {
    return (
      <>
        <div className={styles.header_div}>
          <Button variant='outline-secondary' className={styles.refreshButton} onClick={refresh}>
            {refreshing ? (
              <div style={{ height: "25.5px" }}>
                <Spinner
                  animation='border'
                  role='status'
                  style={Utilities.loadingSpinnerSmall}></Spinner>
              </div>
            ) : (
              <Icon icon={reload} size={22}></Icon>
            )}
          </Button>
          <Moment key={lastRefresh.getTime()} className={styles.lastRefresh} fromNow>
            {lastRefresh}
          </Moment>
          {/* {refreshing ? (
            <Spinner
              animation='border'
              role='status'
              style={Utilities.loadingSpinnerSmall}></Spinner>
          ) : (
            <Moment key={lastRefresh.getTime()} className={styles.lastRefresh} fromNow>
              {lastRefresh}
            </Moment>
          )} */}
          {requestError && requestError.code === 403 ? (
            <Alert
              key={requestError.errors[0].reason}
              className={styles.requestError}
              variant={"warning"}>
              {requestError.errors[0].reason + " - Cache used instead."}
            </Alert>
          ) : null}
          <h4 className={styles.container_header}>Youtube</h4>
        </div>
        <div className={styles.container}>
          {videos.map(video => {
            return (
              <LazyLoad key={video.contentDetails.upload.videoId} height={312} offset={100} once>
                <RenderYoutube
                  id={video.contentDetails.upload.videoId}
                  data={video}
                  run={{ initial: initialOpen.current }}
                  runChange={onChange}
                  // key={video.contentDetails.upload.videoId}
                />
              </LazyLoad>
            );
          })}
        </div>
      </>
    );
  }
}

export default Youtube;
