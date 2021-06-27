import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';

import AccountContext from '../account/AccountContext';
import AlertHandler from '../alert';
import getMyFollowedChannels from './getMyFollowedChannels';
import GetSubscriptionVideos from './GetSubscriptionVideos';
import useToken from './useToken';

const Datahandler = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [requestError, setRequestError] = useState();
  const followedChannels = useRef();
  const [videos, setVideos] = useState([]);
  const { youtubeToken, authKey } = useContext(AccountContext);
  const validateToken = useToken();

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
    validateToken({ authKey }).then(() => fetchData());
  }, [authKey, setVideos, validateToken]);

  useEffect(() => {
    refresh().catch((e) => setError(e));
  }, [refresh]);

  if (!youtubeToken) {
    return (
      <AlertHandler
        title="Couldn't load Youtube feed"
        message='You are not connected with your Youtube account to AioFeed'
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
