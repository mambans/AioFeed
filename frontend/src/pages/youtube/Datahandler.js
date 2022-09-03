import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';

import GetSubscriptionVideos from './GetSubscriptionVideos';
import useToken, { YoutubeContext } from './useToken';
import Alert from '../../components/alert';
import TwitchAPI, { pagination } from '../twitch/API';

const Datahandler = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [requestError, setRequestError] = useState();
  const followedChannels = useRef();
  const [videos, setVideos] = useState([]);
  const { youtubeAccessToken } = useContext(YoutubeContext);
  const validateToken = useToken();

  const refresh = useCallback(async () => {
    const fetchData = async () => {
      try {
        followedChannels.current = pagination(
          await TwitchAPI.getMyFollowedChannels({ first: 100 })
        );

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
    validateToken().then(() => fetchData());
  }, [setVideos, validateToken]);

  useEffect(() => {
    refresh().catch((e) => setError(e));
  }, [refresh]);

  if (!youtubeAccessToken) {
    return (
      <Alert
        title="Couldn't load Youtube feed"
        message='You have not connected your Youtube account with to AioFeed'
        fill
      />
    );
  }
  return children({
    isLoaded,
    error,
    videos: videos,
    setVideos: setVideos,
    followedChannels: followedChannels.current,
    refresh,
    requestError,
  });
};

export default Datahandler;
