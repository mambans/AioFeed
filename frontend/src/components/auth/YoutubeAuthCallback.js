import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

import { getCookie, AddCookie } from '../../util';
import AlertHandler from './../alert';
import AccountContext from './../account/AccountContext';
import NavigationContext from './../navigation/NavigationContext';
import LoadingIndicator from '../LoadingIndicator';
import API from '../navigation/API';

const YoutubeAuthCallback = () => {
  const { setVisible, setFooterVisible } = useContext(NavigationContext);
  const [error, setError] = useState();
  const { username } = useContext(AccountContext);
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
      AddCookie('Youtube-access_token', res.data.access_token);
      AddCookie('Youtube-access_token_expire', res.data.expires_in);
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
        AddCookie('YoutubeUsername', res.data.items[0].snippet.title);
        AddCookie('YoutubeProfileImg', res.data.items[0].snippet.thumbnails.default.url);

        return {
          Username: res.data.items[0].snippet.title,
          ProfileImg: res.data.items[0].snippet.thumbnails.default.url,
        };
      });

    if (username) {
      await API.updateAccount('YoutubePreferences', {
        Username: MyYoutube.Username,
        Profile: MyYoutube.ProfileImg,
        Token: tokens.access_token,
        Refresh_token: tokens.refresh_token,
      });
    }

    return { access_token: tokens.access_token, refresh_token: tokens.refresh_token, ...MyYoutube };
  }, [username, location.search]);

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
              console.log('res', res);
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

  if (error) return <AlertHandler data={error} />;
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
