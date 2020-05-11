import React, { useEffect, useRef, useState, useCallback, useContext } from "react";

import ErrorHandler from "../error";
import getFollowedChannels from "./GetFollowedChannels";
import GetSubscriptionVideos from "./GetSubscriptionVideos";
import AccountContext from "../account/AccountContext";
import validateToken from "./validateToken";

export default ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [requestError, setRequestError] = useState();
  const followedChannels = useRef();
  // const videos = useRef(null);
  const [videos, setVideos] = useState([]);
  const oldVideos = useRef(null);
  const { youtubeToken, authKey } = useContext(AccountContext);

  const refresh = useCallback(async () => {
    async function fetchData() {
      try {
        setIsLoaded(false);
        followedChannels.current = await getFollowedChannels();

        const SubscriptionData = await GetSubscriptionVideos(followedChannels.current);
        setVideos(SubscriptionData.data);

        if (SubscriptionData.error) {
          setRequestError(SubscriptionData.error.response.data.error);
        } else {
          setRequestError();
        }

        setIsLoaded(Date.now());
      } catch (error) {
        setIsLoaded(Date.now());
        setError(error);
      }
    }
    await validateToken({ authKey }).then(async (res) => {
      await fetchData();
    });
  }, [authKey, setVideos]);

  useEffect(() => {
    if (oldVideos.current && videos) {
      videos.forEach((video) => {
        const videoExists = oldVideos.current.find((old_video) => {
          return old_video.contentDetails.upload.videoId === video.contentDetails.upload.videoId;
        });

        if (!videoExists) console.log("New video Notification.");
        return "";
      });
    }

    if (videos.length >= 1) oldVideos.current = videos;
  }, [videos]);

  useEffect(() => {
    (async () => {
      try {
        refresh();
      } catch (error) {
        setError(error);
      }
    })();
  }, [refresh]);

  if (!youtubeToken) {
    return (
      <ErrorHandler
        data={{
          title: "Couldn't load Youtube feed",
          message: "You are not connected with your Youtube account to AioFeed",
        }}></ErrorHandler>
    );
  } else {
    return children({
      isLoaded,
      error,
      videos: videos,
      setVideos: setVideos,
      followedChannels: followedChannels.current,
      refresh,
      requestError,
    });
  }
};
