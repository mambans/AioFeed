import React, { useEffect, useRef, useState, useCallback, useContext } from "react";

import ErrorHandler from "../error";
import getFollowedChannels from "./GetFollowedChannels";
import GetSubscriptionVideos from "./GetSubscriptionVideos";
import AccountContext from "../account/AccountContext";

export default ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [initiated, setInitiated] = useState(false);
  const [error, setError] = useState(null);
  const [requestError, setRequestError] = useState();
  const followedChannels = useRef();
  const videos = useRef(null);
  const oldVideos = useRef(null);
  const { youtubeToken } = useContext(AccountContext);

  const refresh = useCallback(async () => {
    async function fetchData() {
      try {
        setIsLoaded(false);
        followedChannels.current = await getFollowedChannels();

        const SubscriptionData = await GetSubscriptionVideos(followedChannels.current);
        oldVideos.current = videos.current || SubscriptionData.data;
        videos.current = SubscriptionData.data;

        if (SubscriptionData.error) setRequestError(SubscriptionData.error.response.data.error);

        setIsLoaded(new Date());
        videos.current.forEach((video) => {
          const videoExists = oldVideos.current.find((old_video) => {
            return old_video.contentDetails.upload.videoId === video.contentDetails.upload.videoId;
          });

          if (!videoExists) console.log("New video Notification.");
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
    (async () => {
      try {
        setInitiated(false);

        refresh();

        setInitiated(new Date());
      } catch (error) {
        setInitiated(new Date());
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
      initiated,
      error,
      videos: videos.current,
      followedChannels: followedChannels.current,
      refresh,
      requestError,
    });
  }
};
