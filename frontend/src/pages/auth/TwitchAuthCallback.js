import React, { useEffect, useState, useCallback, useContext } from 'react';

import { AddCookie, getCookie } from '../../util';
import AccountContext from './../account/AccountContext';
import NavigationContext from './../navigation/NavigationContext';
import LoadingIndicator from '../../components/LoadingIndicator';
import TwitchAPI from '../twitch/API';
import aiofeedAPI from '../navigation/API';
import { TwitchContext } from '../twitch/useToken';
import Alert from '../../components/alert';

const TwitchAuthCallback = () => {
  const [error, setError] = useState();
  const {
    setTwitchAccessToken,
    setTwitchRefreshToken,
    setTwitchUserId,
    setTwitchUsername,
    setTwitchProfileImage,
  } = useContext(TwitchContext) || {};
  const { username } = useContext(AccountContext) || {};
  const { setVisible, setFooterVisible } = useContext(NavigationContext) || {};

  const getAccessToken = useCallback(
    async (url) => {
      const authCode = url.searchParams.get('code');

      const requestAccessToken = await aiofeedAPI.getTwitchAccessToken(authCode);

      const accessToken = requestAccessToken.data.access_token;
      const refreshToken = requestAccessToken.data.refresh_token;
      if (setTwitchAccessToken) setTwitchAccessToken(accessToken);
      if (setTwitchRefreshToken) setTwitchRefreshToken(refreshToken);

      const MyTwitch = await TwitchAPI.getMe({ accessToken: accessToken }).then(async (res) => {
        setTwitchUserId(res.data.data[0].id);
        setTwitchUsername(res.data.data[0].login);
        setTwitchProfileImage(res.data.data[0].profile_image_url);

        if (username) {
          await aiofeedAPI.updateTwitchUserData(
            {
              Username: res.data.data[0].login,
              Id: res.data.data[0].id,
              Profile: res.data.data[0].profile_image_url,
            },
            accessToken,
            refreshToken
          );
        }

        return {
          Username: res.data.data[0].login,
          ProfileImg: res.data.data[0].profile_image_url,
          userId: res.data.data[0].id,
        };
      });

      return { token: accessToken, refresh_token: refreshToken, ...MyTwitch };
    },
    [
      username,
      setTwitchAccessToken,
      setTwitchRefreshToken,
      setTwitchUserId,
      setTwitchUsername,
      setTwitchProfileImage,
    ]
  );

  useEffect(() => {
    if (setVisible) setVisible(false);
    if (setFooterVisible) setFooterVisible(false);
    (async function () {
      try {
        const url = new URL(window.location.href);
        if (url.pathname === '/auth/twitch/callback') {
          if (url.searchParams.get('state') === getCookie('Twitch-myState')) {
            await getAccessToken(url)
              .then((res) => {
                console.log('successfully authenticated to Twitch.');
                if (res.token) AddCookie('Twitch-access_token', res.token);

                window.opener.postMessage(
                  {
                    service: 'twitch',
                    token: res.token,
                    refresh_token: res.refresh_token,
                    username: res.Username,
                    profileImg: res.ProfileImg,
                    userId: res.userId,
                  },
                  '*'
                );

                if (res.token) setTimeout(() => window.close(), 1);
              })
              .catch((error) => {
                console.log('getAccessToken() failed');
                setError(error);
              });
          } else {
            setError({
              title: 'Twitch authentication failed.',
              message: "Request didn't come from this website.!",
            });
          }
        } else {
          setError({
            title: 'Twitch authentication failed.',
            message: 'Authenticate to Twitch failed.',
          });
        }
      } catch (error) {
        setError(error);
      }
    })();
  }, [getAccessToken, setVisible, setFooterVisible]);

  console.log('twitch auth callback error:', error);
  if (error) return <Alert data={error} />;
  return (
    <LoadingIndicator
      height={150}
      width={150}
      text={'Authenticating..'}
      smallText={'Talking with Twitch..'}
    />
  );
};

export default TwitchAuthCallback;
