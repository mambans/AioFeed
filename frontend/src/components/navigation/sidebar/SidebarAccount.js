import { Button } from "react-bootstrap";
import { FaTwitch } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";
import React, { useContext, useState } from "react";
import uniqid from "uniqid";

import Themeselector from "./../../themes/Themeselector";
import ToggleSwitch from "./ToggleSwitch";
import UpdateProfileImg from "./UpdateProfileImg";
import {
  StyledProfileImg,
  StyledConnectTwitch,
  StyledConnectYoutube,
  StyledLogoutContiner,
  ShowAddFormBtn,
  StyledConnectContainer,
  StyledReconnectIcon,
  CloseAddFormBtn,
  ProfileImgContainer,
} from "./StyledComponent";
import AccountContext from "./../../account/AccountContext";
import DeleteAccountButton from "./DeleteAccountButton";
import FeedsContext from "./../../feed/FeedsContext";
import UpdateTwitterListName from "./UpdateTwitterListName";
import ClearAllAccountCookiesStates from "./ClearAllAccountCookiesStates";
import { RemoveCookie, AddCookie, getCookie } from "../../../util/Utils";

export default () => {
  const {
    username,
    setUsername,
    profileImage,
    twitchUsername,
    twitchProfileImg,
    setTwitchToken,
    setYoutubeToken,
    twitchToken,
    youtubeToken,
    autoRefreshEnabled,
    setAutoRefreshEnabled,
    youtubeUsername,
    youtubeProfileImg,
  } = useContext(AccountContext);

  const {
    enableTwitch,
    setEnableTwitch,
    enableTwitchVods,
    setEnableTwitchVods,
    showTwitchSidebar,
    setShowTwitchSidebar,
    enableYoutube,
    setEnableYoutube,
    twitchVideoHoverEnable,
    setTwitchVideoHoverEnable,
    youtubeVideoHoverEnable,
    setYoutubeVideoHoverEnable,
    enableTwitter,
    setEnableTwitter,
    isEnabledOfflineNotifications,
    setIsEnabledOfflineNotifications,
  } = useContext(FeedsContext);
  const [showAddImage, setShowAddImage] = useState(false);

  function logout() {
    ClearAllAccountCookiesStates(setUsername);
  }

  async function authenticatePopup(winName, domain, urlParam) {
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
  }

  async function disconnectTwitch() {
    await axios
      .post(
        `https://id.twitch.tv/oauth2/revoke?client_id=${
          process.env.REACT_APP_TWITCH_CLIENT_ID
        }&token=${getCookie("Twitch-access_token")}`
      )
      .catch((er) => {
        console.error(er);
      });

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
        username: username,
        columnName: "TwitchPreferences",
        columnValue: {},
      })
      .then(() => {
        RemoveCookie("Twitch-access_token");
        RemoveCookie("Twitch-refresh_token");
        RemoveCookie("Twitch-userId");
        RemoveCookie("Twitch-username");
        RemoveCookie("Twitch-profileImg");
        RemoveCookie("TwitchVods_FeedEnabled");
        RemoveCookie("Twitch-myState");
        RemoveCookie("Twitch_AutoRefresh");

        setTwitchToken();
        setEnableTwitch(false);
        console.log(`Successfully disconnected from Twitch`);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  async function disconnectYoutube() {
    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
        username: username,
        columnName: "YoutubePreferences",
        columnValue: {},
      })
      .then(() => {
        RemoveCookie("Youtube-access_token");
        RemoveCookie("YoutubeUsername");
        RemoveCookie("YoutubeProfileImg");
        RemoveCookie("Youtube_FeedEnabled");

        setYoutubeToken();
        setEnableYoutube(false);
        console.log(`Successfully disconnected from Youtube`);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <>
      <div style={{ minHeight: "calc(100% - 120px)" }}>
        <ProfileImgContainer>
          {showAddImage ? (
            <CloseAddFormBtn
              onClick={() => {
                setShowAddImage(false);
              }}
            />
          ) : (
            <ShowAddFormBtn
              onClick={() => {
                setShowAddImage(true);
              }}>
              Change Profile image
            </ShowAddFormBtn>
          )}
          {showAddImage && (
            <UpdateProfileImg
              close={() => {
                setShowAddImage(false);
              }}
            />
          )}
          <StyledProfileImg
            src={profileImage || `${process.env.PUBLIC_URL}/images/placeholder.jpg`}
            alt=''
          />
        </ProfileImgContainer>
        <h1 style={{ fontSize: "2rem", textAlign: "center" }} title='Username'>
          {username}
        </h1>
        <p style={{ textAlign: "center" }} title='Email'>
          {getCookie("AioFeed_AccountEmail")}
        </p>
        <ToggleSwitch
          setEnable={(value) => {
            setEnableTwitch(value);
            AddCookie("Twitch_FeedEnabled", value);
          }}
          enabled={enableTwitch}
          label='Twitch'
          tokenExists={twitchToken}
          tooltip={
            twitchToken
              ? (enableTwitch ? "Disable" : "Enable") + ` Twitch feed`
              : `Need to connect/authenticate with a Twitch account first.`
          }
        />
        <ToggleSwitch
          setEnable={(value) => {
            setEnableTwitter(value);
            AddCookie("Twitter_FeedEnabled", value);
          }}
          enabled={enableTwitter}
          label='Twitter'
          tokenExists={true}
          tooltip={(enableTwitter ? "Disable" : "Enable") + ` Twitter feed`}
          // tokenExists={twitterListName}
        />
        <UpdateTwitterListName />
        <ToggleSwitch
          setEnable={(value) => {
            setEnableYoutube(value);
            AddCookie("Youtube_FeedEnabled", value);
          }}
          enabled={enableYoutube}
          label='Youtube'
          tokenExists={youtubeToken}
          tooltip={
            youtubeToken
              ? (enableYoutube ? "Disable" : "Enable") + ` Twitch feed`
              : `Need to connect/authenticate with a Youtube account first.`
          }
        />
        <ToggleSwitch
          setEnable={(value) => {
            setEnableTwitchVods(value);
            AddCookie("TwitchVods_FeedEnabled", value);
          }}
          enabled={enableTwitchVods}
          label='TwitchVods'
          tokenExists={twitchToken}
          tooltip={
            twitchToken
              ? (enableTwitchVods ? "Disable" : "Enable") + ` Twitch feed`
              : `Need to connect/authenticate with a Twitch account first.`
          }
        />
        <br />
        <ToggleSwitch
          setEnable={(value) => {
            setAutoRefreshEnabled(value);
            AddCookie("Twitch_AutoRefresh", value);
          }}
          enabled={autoRefreshEnabled}
          label='Twitch auto-refresh (25s)'
          tokenExists={twitchToken}
          tooltip={
            twitchToken
              ? (autoRefreshEnabled ? "Disable" : "Enable") + `Twitch auto refresh`
              : `Need to connect/authenticate with a Twitch account first.`
          }
          width={40}
          height={20}
        />
        <ToggleSwitch
          setEnable={(value) => {
            setShowTwitchSidebar(value);
            AddCookie("Twitch_SidebarEnabled", value);
          }}
          enabled={showTwitchSidebar}
          label='Twitch sidebar'
          tokenExists={twitchToken}
          tooltip={
            twitchToken
              ? (showTwitchSidebar ? "Hide" : "Show") + `Twitch Sidebar`
              : `Need to connect/authenticate with a Twitch account first.`
          }
          width={40}
          height={20}
        />

        <ToggleSwitch
          setEnable={(value) => {
            setIsEnabledOfflineNotifications(value);
            AddCookie("Twitch_offline_notifications", value);
          }}
          enabled={isEnabledOfflineNotifications}
          label='Twitch offline notifications'
          tokenExists={twitchToken}
          tooltip={
            twitchToken
              ? (isEnabledOfflineNotifications ? "Disable" : "Enable") +
                `notifications for when streams go offline`
              : `Need to connect/authenticate with a Twitch account first.`
          }
          width={40}
          height={20}
        />
        <ToggleSwitch
          setEnable={(value) => {
            setTwitchVideoHoverEnable(value);
            AddCookie("TwitchVideoHoverEnabled", value);
          }}
          enabled={twitchVideoHoverEnable}
          label='Twitch hover-video'
          tokenExists={twitchToken}
          tooltip={
            twitchToken
              ? (twitchVideoHoverEnable ? "Disable" : "Enable") + `video on hover`
              : `Need to connect/authenticate with a Youtube account first.`
          }
          width={40}
          height={20}
        />
        <ToggleSwitch
          setEnable={(value) => {
            setYoutubeVideoHoverEnable(value);
            AddCookie("YoutubeVideoHoverEnabled", value);
          }}
          enabled={youtubeVideoHoverEnable}
          label='Youtube hover-video'
          tokenExists={youtubeToken}
          tooltip={
            youtubeToken
              ? (youtubeVideoHoverEnable ? "Disable" : "Enable") + `video on hover`
              : `Need to connect/authenticate with a Youtube account first.`
          }
          width={40}
          height={20}
        />
        <br></br>
        {!twitchToken ? (
          <StyledConnectContainer>
            <StyledConnectTwitch
              id='connect'
              title='Authenticate/Connect'
              onClick={() => {
                authenticatePopup(
                  `Connect Twitch`,
                  "Twitch",
                  `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=https://aiofeed.com/auth/twitch/callback&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit+clips:edit&response_type=code&force_verify=true`,
                  setEnableTwitch
                );
              }}>
              <FaTwitch size={24} />
              Connect Twitch
            </StyledConnectTwitch>
          </StyledConnectContainer>
        ) : (
          <StyledConnectContainer>
            <div className='username' id='Twitch'>
              <div
                title='Re-authenticate'
                onClick={() => {
                  authenticatePopup(
                    `Connect Twitch`,
                    "Twitch",
                    `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=https://aiofeed.com/auth/twitch/callback&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit+clips:edit&response_type=code`,
                    setEnableTwitch
                  );
                }}>
                <StyledReconnectIcon id='reconnectIcon' />
                <img title='Re-authenticate' src={twitchProfileImg} alt='' />
              </div>
              <p>{twitchUsername}</p>
            </div>
            <StyledConnectTwitch
              id='disconnect'
              title='Disconnect'
              style={{
                backgroundColor: "hsla(268, 77%, 15%, 1)",
                minWidth: "42px",
                width: "42px",
              }}
              onClick={disconnectTwitch}>
              <FiLogOut
                size={24}
                style={{
                  marginRight: "0",
                }}
              />
            </StyledConnectTwitch>
          </StyledConnectContainer>
        )}
        {!youtubeToken ? (
          <StyledConnectContainer>
            <StyledConnectYoutube
              //to unfollow: scope=https://www.googleapis.com/auth/youtube
              //else  scope=https://www.googleapis.com/auth/youtube.readonly
              title='Authenticate/Connect'
              onClick={() => {
                authenticatePopup(
                  `Connect Youtube`,
                  "Youtube",
                  `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=https://aiofeed.com/auth/youtube/callback&response_type=token&scope=https://www.googleapis.com/auth/youtube`,
                  setEnableYoutube
                );
              }}>
              <FaYoutube size={30} />
              Connect Youtube
            </StyledConnectYoutube>
          </StyledConnectContainer>
        ) : (
          <StyledConnectContainer>
            <div className='username' id='Youtube'>
              <div
                //to unfollow: scope=https://www.googleapis.com/auth/youtube
                //else  scope=https://www.googleapis.com/auth/youtube.readonly
                title='Re-authenticate'
                onClick={() => {
                  authenticatePopup(
                    `Connect Youtube`,
                    "Youtube",
                    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=https://aiofeed.com/auth/youtube/callback&response_type=token&scope=https://www.googleapis.com/auth/youtube`,
                    setEnableYoutube
                  );
                }}>
                <StyledReconnectIcon id='reconnectIcon' />
                <img title='Re-authenticate' src={youtubeProfileImg} alt='' />
              </div>
              <p>{youtubeUsername}</p>
            </div>
            <StyledConnectYoutube
              id='disconnect'
              title='Disconnect'
              style={{ backgroundColor: "hsla(0, 65%, 10%, 1)", minWidth: "42px", width: "42px" }}
              onClick={disconnectYoutube}>
              <FiLogOut
                size={30}
                style={{
                  marginRight: "0",
                }}
              />
            </StyledConnectYoutube>
          </StyledConnectContainer>
        )}
        <Themeselector />
      </div>
      <StyledLogoutContiner>
        <DeleteAccountButton />
        <Button style={{ width: "100%" }} label='logout' onClick={logout} variant='secondary'>
          Logout
          <GoSignOut size={24} style={{ marginLeft: "0.75rem" }} />
        </Button>
      </StyledLogoutContiner>
    </>
  );
};
