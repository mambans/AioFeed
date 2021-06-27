import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

import { getCookie, AddCookie } from '../../util/Utils';
import AlertHandler from './../alert';
import AccountContext from './../account/AccountContext';
import NavigationContext from './../navigation/NavigationContext';
import LoadingIndicator from '../LoadingIndicator';

const YoutubeAuthCallback = () => {
  const { setVisible, setFooterVisible } = useContext(NavigationContext);
  const [error, setError] = useState();
  const { username, authKey } = useContext(AccountContext);
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

    const tokens = await axios
      .post(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/youtube/token`, {
        code: codeFromUrl,
        username: getCookie('AioFeed_AccountName'),
        authkey: authKey,
      })
      .then(async (res) => {
        AddCookie('Youtube-access_token', res.data.access_token);
        AddCookie('Youtube-access_token_expire', res.data.expires_in);

        return { access_token: res.data.access_token, refresh_token: res.data.refresh_token };
      })
      .catch((e) => console.error(e));

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
      await axios
        .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
          username: username,
          columnName: 'YoutubePreferences',
          columnValue: {
            Username: MyYoutube.Username,
            Profile: MyYoutube.ProfileImg,
            Token: tokens.access_token,
            Refresh_token: tokens.refresh_token,
          },
          authkey: getCookie(`AioFeed_AuthKey`),
        })
        .catch((e) => console.error(e));
    }

    return { access_token: tokens.access_token, refresh_token: tokens.refresh_token, ...MyYoutube };
  }, [username, location.search, authKey]);

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
