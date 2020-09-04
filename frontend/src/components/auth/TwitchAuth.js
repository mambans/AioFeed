import React, { useEffect, useState, useCallback } from 'react';
import uniqid from 'uniqid';

import AlertHandler from './../alert';
import { AddCookie } from '../../util/Utils';
import LoadingIndicator from '../LoadingIndicator';

function TwitchAuth() {
  const [error, setError] = useState();

  const initiateAuth = useCallback(async () => {
    async function generateOrginState() {
      return uniqid();
    }

    const orginState = await generateOrginState();
    AddCookie('Twitch-myState', orginState);

    window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=https://aiofeed.com/auth/twitch/callback&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit+user:edit:follows&response_type=code&state=${orginState}`;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);

        url.href === 'https://aiofeed.com/auth/twitch'
          ? await initiateAuth()
          : setError({ message: 'Visit account page to authenticate with Twitch.' });
      } catch (error) {
        setError(error);
      }
    })();
  }, [initiateAuth]);

  if (error) return <AlertHandler data={error} />;
  return <LoadingIndicator height={150} width={150} />;
}

export default TwitchAuth;
