import uniqid from 'uniqid';
import { FaTwitch } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import React, { useContext } from 'react';

import {
  StyledConnectTwitch,
  StyledConnectYoutube,
  StyledConnectContainer,
  StyledReconnectIcon,
} from './StyledComponents';
import { AddCookie } from '../../../util';
import { TwitchContext } from '../../twitch/useToken';
import { YoutubeContext } from '../../youtube/useToken';
import ToolTip from '../../../components/tooltip/ToolTip';

const authenticatePopup = async (domain, urlParam) => {
  const generateOrginState = async () => uniqid();

  const orginState = await generateOrginState();

  AddCookie(`${domain}-myState`, orginState);

  const url = urlParam + `&state=${orginState}`;
  const LeftPosition = window.screen.width ? (window.screen.width - 700) / 2 : 0;
  const TopPosition = window.screen.height ? (window.screen.height - 850) / 2 : 0;
  const settings = `height=700,width=600,top=${TopPosition},left=${LeftPosition},scrollbars=yes,resizable`;

  try {
    window.open(url, `Connect ${domain}`, settings);
  } catch (e) {
    alert('Another Authendicate popup window might already be open.');
    console.error('Another Authendicate popup window might already be open.');
    console.error('Auth Popup error:', e);
  }
};

const TwitchBaseAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=https://aiofeed.com/auth/twitch/callback&scope=user:edit+user:read:broadcast+user_follows_edit+user:edit:follows+user:read:follows+clips:edit&response_type=code`;
console.log('TwitchBaseAuthUrl:', TwitchBaseAuthUrl);

//to unfollow: scope=https://www.googleapis.com/auth/youtube
//else  scope=https://www.googleapis.com/auth/youtube.readonly
const YoutubeBaseAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=https://aiofeed.com/auth/youtube/callback&response_type=code&scope=https://www.googleapis.com/auth/youtube&access_type=offline`;

const ReAuthenticateButton = ({ disconnect, serviceName, style }) => {
  const { twitchUsername, twitchProfileImage } = useContext(TwitchContext);
  const { youtubeUsername, setYoutubeProfileImage, youtubeAccessToken } =
    useContext(YoutubeContext);

  const AuthButton = {
    Twitch: !twitchUsername ? (
      <ToolTip tooltip='Authenticate to Twitch'>
        <StyledConnectTwitch
          id='connect'
          onClick={() => authenticatePopup('Twitch', `${TwitchBaseAuthUrl}&force_verify=true`)}
        >
          <FaTwitch size={24} />
          Connect Twitch
        </StyledConnectTwitch>
      </ToolTip>
    ) : (
      <>
        <div className='username' id='Twitch'>
          <div
            title='Re-authenticate'
            onClick={() => authenticatePopup('Twitch', `${TwitchBaseAuthUrl}`)}
          >
            <StyledReconnectIcon id='reconnectIcon' />
            <img title='Re-authenticate' src={twitchProfileImage} alt='' />
          </div>
          <p id='name'>{twitchUsername}</p>
        </div>
        {disconnect && (
          <StyledConnectTwitch id='disconnect' title='Disconnect' onClick={disconnect}>
            <FiLogOut size={24} />
          </StyledConnectTwitch>
        )}
      </>
    ),
    Youtube: !youtubeAccessToken ? (
      <ToolTip tooltip={'Authenticate to YouTube'}>
        <StyledConnectYoutube
          id='connect'
          title='Authenticate/Connect'
          onClick={() => authenticatePopup('Youtube', `${YoutubeBaseAuthUrl}&prompt=consent`)}
        >
          <FaYoutube size={30} />
          Connect Youtube
        </StyledConnectYoutube>
      </ToolTip>
    ) : (
      <>
        <div className='username' id='Youtube'>
          <div
            title='Re-authenticate'
            onClick={() => authenticatePopup('Youtube', `${YoutubeBaseAuthUrl}&prompt=consent`)}
          >
            <StyledReconnectIcon id='reconnectIcon' />
            <img title='Re-authenticate' src={setYoutubeProfileImage} alt='' />
          </div>
          <p id='name'>{youtubeUsername}</p>
        </div>
        {disconnect && (
          <StyledConnectYoutube id='disconnect' title='Disconnect' onClick={disconnect}>
            <FiLogOut size={30} />
          </StyledConnectYoutube>
        )}
      </>
    ),
  };

  return (
    <StyledConnectContainer style={{ ...style }}>{AuthButton[serviceName]}</StyledConnectContainer>
  );
};

export default ReAuthenticateButton;
