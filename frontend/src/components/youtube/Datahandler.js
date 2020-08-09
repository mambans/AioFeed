import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';

import AccountContext from '../account/AccountContext';
import ErrorHandler from '../error';
import getMyFollowedChannels from './getMyFollowedChannels';
import GetSubscriptionVideos from './GetSubscriptionVideos';
import validateToken from './validateToken';

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
    const fetchData = async () => {
      try {
        followedChannels.current = await getMyFollowedChannels();

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
    };
    setIsLoaded(false);
    await validateToken({ authKey }).then(() => {
      fetchData();
    });
  }, [authKey, setVideos]);

  useEffect(() => {
    if (oldVideos.current && videos) {
      videos.forEach((video) => {
        const videoExists = oldVideos.current.find((old_video) => {
          return old_video.contentDetails.upload.videoId === video.contentDetails.upload.videoId;
        });

        if (!videoExists) console.log('New video Notification.');
        return '';
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
          message: 'You are not connected with your Youtube account to AioFeed',
        }}
      />
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
