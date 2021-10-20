import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import AccountContext from '../../account/AccountContext';
import { TwitchContext } from '../../twitch/useToken';
import { YoutubeContext } from '../../youtube/useToken';
import NavigationContext from '../NavigationContext';
import clearAllAccountCookiesStates from './ClearAllAccountCookiesStates';
import { GoSignOut } from 'react-icons/go';
import ToolTip from '../../sharedComponents/ToolTip';

const Logout = () => {
  const { setUsername, setProfileImage, setAuthKey, setEmail } = useContext(AccountContext) || {};
  const { setRenderModal } = useContext(NavigationContext);

  const {
    setTwitchRefreshToken,
    setTwitchUserId,
    setTwitchUsername,
    setTwitchProfileImage,
    setTwitchAccessToken,
  } = useContext(TwitchContext) || {};
  const { setYoutubeAccessToken, setYoutubeUsername, setYoutubeProfileImage } =
    useContext(YoutubeContext) || {};

  const logout = () =>
    clearAllAccountCookiesStates({
      setUsername,
      setProfileImage,
      setAuthKey,
      setEmail,
      setTwitchAccessToken,
      setTwitchRefreshToken,
      setTwitchUserId,
      setTwitchUsername,
      setTwitchProfileImage,
      setYoutubeAccessToken,
      setYoutubeUsername,
      setYoutubeProfileImage,
      setRenderModal,
    });

  return (
    <ToolTip tooltip='Logout'>
      <Button style={{ width: '100%' }} onClick={logout} variant='secondary'>
        Logout
        <GoSignOut size={24} style={{ marginLeft: '0.75rem' }} />
      </Button>
    </ToolTip>
  );
};
export default Logout;
