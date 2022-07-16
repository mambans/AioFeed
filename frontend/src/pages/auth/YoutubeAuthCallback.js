import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

import { getCookie, AddCookie } from '../../util';
import NavigationContext from './../navigation/NavigationContext';
import LoadingIndicator from '../../components/LoadingIndicator';
import API from '../navigation/API';
import { YoutubeContext } from '../youtube/useToken';
import Alert from '../../components/alert';

const YoutubeAuthCallback = () => {
  const { setVisible, setFooterVisible } = useContext(NavigationContext);
  const [error, setError] = useState();
  const { setYoutubeAccessToken, setYoutubeUsername, setYoutubeProfileImage } =
    useContext(YoutubeContext);
  const location = useLocation();

  const getAccessToken = useCallback(async () => {
    AddCookie(
      'Youtube-readonly',
      location.search
        .split('&')
        .find((part) => part.includes('scope'))
        .includes('.readonly')
    );

    const codeFromUrl = location.search
      .split('&')
      .find((part) => part.includes('code'))
      .replace('code=', '');

    const tokens = await API.getYoutubeTokens(codeFromUrl).then(async (res) => {
      console.log('resss1:', res);
      setYoutubeAccessToken(res.access_token);
      return res;
    });

    const MyYoutube = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
        {
          headers: {
            Authorization: 'Bearer ' + tokens.access_token,
            Accept: 'application/json',
          },
        }
      )
      .then((res) => {
        setYoutubeUsername(res.data.items[0].snippet.title);
        setYoutubeProfileImage(res.data.items[0].snippet.thumbnails.default.url);

        return {
          Username: res.data.items[0].snippet.title,
          ProfileImg: res.data.items[0].snippet.thumbnails.default.url,
        };
      });

    await API.updateYoutubeUserData(
      {
        Username: MyYoutube.Username,
        Profile: MyYoutube.ProfileImg,
      },
      tokens.access_token,
      tokens.refresh_token
    );

    return { access_token: tokens.access_token, refresh_token: tokens.refresh_token, ...MyYoutube };
  }, [location.search, setYoutubeAccessToken, setYoutubeUsername, setYoutubeProfileImage]);

  useEffect(() => {
    setVisible(false);
    setFooterVisible(false);
    (async () => {
      try {
        const state = location.search
          .split('&')
          .find((part) => part.includes('state'))
          .replace('?state=', '');

        if (state === getCookie('Youtube-myState')) {
          await getAccessToken()
            .then((res) => {
              console.log('res22', res);
              console.log('successfully authenticated to Youtube.');
              window.opener.postMessage(
                {
                  service: 'youtube',
                  token: res.access_token,
                  refreshtoken: res.refresh_token,
                  username: res.Username,
                  profileImg: res.ProfileImg,
                },
                '*'
              );

              if (res.access_token) setTimeout(() => window.close(), 1);
            })
            .catch((error) => setError(error));
        } else {
          setError({ message: "Request didn't come from this website." });
        }
      } catch (error) {
        setError(error);
      }
    })();
  }, [getAccessToken, setVisible, setFooterVisible, location.search]);

  if (error) return <Alert type='error' data={error} />;
  return (
    <LoadingIndicator
      height={150}
      width={150}
      text={'Authenticating..'}
      smallText={'Talking with YouTube..'}
    />
  );
};

export default YoutubeAuthCallback;
