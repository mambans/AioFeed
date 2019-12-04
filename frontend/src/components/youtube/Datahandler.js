import React, { useEffect, useRef, useState, useCallback } from "react";
import { store } from "react-notifications-component";
import { Spinner } from "react-bootstrap";

import ErrorHandeling from "../error/Error";
import getFollowedChannels from "./GetFollowedChannels";
import getSubscriptionVideos from "./GetSubscriptionVideos";
import Utilities from "./../../utilities/Utilities";

const addNotification = (type, video) => {
  store.addNotification({
    title: video.snippet.channelTitle,
    message: `${Utilities.truncate(video.snippet.title, 50)}`,
    content: (
      <div className={`notification-custom-${type}`}>
        <div className='notification-custom-icon'>
          <img
            src={video.snippet.thumbnails.medium.url}
            alt=''
            className={"youtube-notificationProfileIcon"}></img>
        </div>
        <div className='notification-custom-content'>
          <p className='notification-title'>{video.snippet.channelTitle}</p>
          <p className='notification-message'>{Utilities.truncate(video.snippet.title, 50)}</p>
          <p className='notification-duration'>{video.duration}</p>
        </div>
      </div>
    ),
    width: 450,
    insert: "top",
    container: "bottom-right",
    animationIn: ["animated", "slideInRight"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 7500,
    },
  });
};

function DataHandler({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [initiated, setInitiated] = useState(false);
  const [error, setError] = useState(null);
  const [requestError, setRequestError] = useState();
  const followedChannels = useRef();
  const videos = useRef(null);
  const oldVideos = useRef(null);

  const refresh = useCallback(() => {
    async function fetchData() {
      try {
        setIsLoaded(false);
        followedChannels.current = await getFollowedChannels();

        const SubscriptionData = await getSubscriptionVideos(followedChannels.current);
        oldVideos.current = videos.current;
        videos.current = SubscriptionData.data;

        if (SubscriptionData.error) setRequestError(SubscriptionData.error.response.data.error);

        setIsLoaded(new Date());
        videos.current.forEach(video => {
          let videoExists = oldVideos.current.find(old_video => {
            return old_video.contentDetails.upload.videoId === video.contentDetails.upload.videoId;
          });

          if (!videoExists) addNotification("youtube-new-video", video);
          return "";
        });
      } catch (error) {
        setIsLoaded(new Date());
        setError(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setInitiated(false);
        followedChannels.current = await getFollowedChannels();

        const SubscriptionData = await getSubscriptionVideos(followedChannels.current);
        videos.current = SubscriptionData.data;

        if (SubscriptionData.error) setRequestError(SubscriptionData.error.response.data.error);

        setInitiated(new Date());
        setIsLoaded(new Date());
      } catch (error) {
        console.log("TCL: fetchData -> error", error);
        setInitiated(new Date());
        setIsLoaded(new Date());
        setError(error);
      }
    }

    fetchData();
  }, []);
  if (Utilities.getCookie("Youtube-access_token") === null) {
    return (
      <ErrorHandeling
        data={{
          title: "Couldn't load Youtube feed",
          message: "You are not connected with your Youtube account to Notifies",
        }}></ErrorHandeling>
    );
  } else if (videos.current && videos.current.length > 1) {
    return children({
      isLoaded,
      refresh,
      requestError,
      error,
      followedChannels: followedChannels.current,
      videos: videos.current,
      initiated,
    });
  } else {
    return (
      <Spinner
        animation='grow'
        role='status'
        id='123'
        style={Utilities.loadingSpinne}
        variant='light'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  }
}

export default DataHandler;
