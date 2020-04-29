import uniqid from "uniqid";
import { FaTwitch } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import React, { useContext } from "react";

import {
  StyledConnectTwitch,
  StyledConnectYoutube,
  StyledConnectContainer,
  StyledReconnectIcon,
} from "./StyledComponent";
import AccountContext from "./../../account/AccountContext";
import FeedsContext from "./../../feed/FeedsContext";
import { AddCookie } from "../../../util/Utils";

const authenticatePopup = async (winName, domain, urlParam) => {
  async function generateOrginState() {
    return uniqid();
  }

  const orginState = await generateOrginState();

  AddCookie(`${domain}-myState`, orginState);

  const url = urlParam + `&state=${orginState}`;
  const LeftPosition = window.screen.width ? (window.screen.width - 700) / 2 : 0;
  const TopPosition = window.screen.height ? (window.screen.height - 850) / 2 : 0;
  const settings = `height=700,width=600,top=${TopPosition},left=${LeftPosition},scrollbars=yes,resizable`;

  try {
    window.open(url, winName, settings);
  } catch (e) {
    alert("Another Authendicate popup window might already be open.");
    console.error("Another Authendicate popup window might already be open.");
    console.error("Auth Popup error:", e);
  }
};

export default ({ disconnect, serviceName, style }) => {
  console.log("serviceName", serviceName);
  const {
    twitchUsername,
    twitchProfileImg,
    twitchToken,
    youtubeToken,
    youtubeUsername,
    youtubeProfileImg,
  } = useContext(AccountContext);

  const { setEnableTwitch, setEnableYoutube } = useContext(FeedsContext);

  if (serviceName === "Twitch") {
    if (!twitchToken) {
      return (
        <StyledConnectContainer>
          <StyledConnectTwitch
            id='connect'
            title='Authenticate/Connect'
            onClick={() => {
              authenticatePopup(
                `Connect Twitch`,
                "Twitch",
                `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/twitch/callback&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit+clips:edit&response_type=code&force_verify=true`,
                setEnableTwitch
              );
            }}>
            <FaTwitch size={24} />
            Connect Twitch
          </StyledConnectTwitch>
        </StyledConnectContainer>
      );
    } else {
      return (
        <StyledConnectContainer>
          <div className='username' id='Twitch'>
            <div
              title='Re-authenticate'
              onClick={() => {
                authenticatePopup(
                  `Connect Twitch`,
                  "Twitch",
                  `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/twitch/callback&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit+clips:edit&response_type=code`,
                  setEnableTwitch
                );
              }}>
              <StyledReconnectIcon id='reconnectIcon' />
              <img title='Re-authenticate' src={twitchProfileImg} alt='' />
            </div>
            <p>{twitchUsername}</p>
          </div>
          {disconnect && (
            <StyledConnectTwitch
              id='disconnect'
              title='Disconnect'
              style={{
                backgroundColor: "hsla(268, 77%, 15%, 1)",
                minWidth: "42px",
                width: "42px",
              }}
              onClick={disconnect}>
              <FiLogOut
                size={24}
                style={{
                  marginRight: "0",
                }}
              />
            </StyledConnectTwitch>
          )}
        </StyledConnectContainer>
      );
    }
  } else if (serviceName === "Youtube") {
    if (!youtubeToken) {
      return (
        <StyledConnectContainer style={{ ...style }}>
          <StyledConnectYoutube
            //to unfollow: scope=https://www.googleapis.com/auth/youtube
            //else  scope=https://www.googleapis.com/auth/youtube.readonly
            title='Authenticate/Connect'
            onClick={() => {
              authenticatePopup(
                `Connect Youtube`,
                "Youtube",
                `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/youtube/callback&response_type=token&scope=https://www.googleapis.com/auth/youtube`,
                setEnableYoutube
              );
            }}>
            <FaYoutube size={30} />
            Connect Youtube
          </StyledConnectYoutube>
        </StyledConnectContainer>
      );
    } else {
      return (
        <StyledConnectContainer style={{ ...style }}>
          <div className='username' id='Youtube'>
            <div
              //to unfollow: scope=https://www.googleapis.com/auth/youtube
              //else  scope=https://www.googleapis.com/auth/youtube.readonly
              title='Re-authenticate'
              onClick={() => {
                authenticatePopup(
                  `Connect Youtube`,
                  "Youtube",
                  `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/youtube/callback&response_type=token&scope=https://www.googleapis.com/auth/youtube`,
                  setEnableYoutube
                );
              }}>
              <StyledReconnectIcon id='reconnectIcon' />
              <img title='Re-authenticate' src={youtubeProfileImg} alt='' />
            </div>
            <p>{youtubeUsername}</p>
          </div>
          {disconnect && (
            <StyledConnectYoutube
              id='disconnect'
              title='Disconnect'
              style={{
                backgroundColor: "hsla(0, 65%, 10%, 1)",
                minWidth: "42px",
                width: "42px",
              }}
              onClick={disconnect}>
              <FiLogOut
                size={30}
                style={{
                  marginRight: "0",
                }}
              />
            </StyledConnectYoutube>
          )}
        </StyledConnectContainer>
      );
    }
  }
};
