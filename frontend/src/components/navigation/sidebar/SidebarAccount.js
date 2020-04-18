import { Button } from "react-bootstrap";
import { MdRefresh } from "react-icons/md";
import { FaTwitch } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";
import React, { useContext, useState } from "react";
import uniqid from "uniqid";

import Themeselector from "./../../themes/Themeselector";
import ToggleSwitch from "./ToggleSwitch";
import ToggleSwitchVideoHover from "./ToggleSwitchVideoHover";
import ToggleSwitchAutoRefresh from "./ToggleSwitchAutoRefresh";
import UpdateProfileImg from "./UpdateProfileImg";
import Util from "../../../util/Util";
import {
  StyledProfileImg,
  StyledConnectTwitch,
  StyledConnectYoutube,
  StyledLogoutContiner,
  ShowAddFormBtn,
  StyledConnectContainer,
  StyledReconnectIcon,
  CloseAddFormBtn,
} from "./StyledComponent";
import AccountContext from "./../../account/AccountContext";
import DeleteAccountButton from "./DeleteAccountButton";
import FeedsContext from "./../../feed/FeedsContext";
import UpdateTwitterListName from "./UpdateTwitterListName";

export default () => {
  const {
    username,
    setUsername,
    profileImage,
    setProfileImage,
    setAuthKey,
    twitchUsername,
    twitchProfileImg,
    setTwitchToken,
    setYoutubeToken,
    twitchToken,
    youtubeToken,
    autoRefreshEnabled,
    setAutoRefreshEnabled,
  } = useContext(AccountContext);

  const {
    enableTwitch,
    setEnableTwitch,
    enableTwitchVods,
    setEnableTwitchVods,
    enableYoutube,
    setEnableYoutube,
    twitchVideoHoverEnable,
    setTwitchVideoHoverEnable,
    youtubeVideoHoverEnable,
    setYoutubeVideoHoverEnable,
    enableTwitter,
    setEnableTwitter,
  } = useContext(FeedsContext);
  const [showAddImage, setShowAddImage] = useState(false);

  function logout() {
    document.cookie = `AioFeed_AccountName=null; path=/`;
    document.cookie = `AioFeed_AccountEmail=null; path=/`;
    document.cookie = `Twitch-access_token=null; path=/; SameSite=Lax`;
    document.cookie = `Youtube-access_token=null; path=/`;
    document.cookie = `AioFeed_AccountProfileImg=null; path=/`;

    document.cookie = `Youtube_FeedEnabled=${false}; path=/`;
    document.cookie = `TwitchVods_FeedEnabled=${false}; path=/`;

    setUsername();
    setProfileImage();
    setAuthKey();
  }

  async function authenticatePopup(winName, domain, urlParam, setFeedEnable) {
    async function generateOrginState() {
      return uniqid();
    }

    const orginState = await generateOrginState();

    document.cookie = `${domain}-myState=${orginState}; path=/`;

    const url = urlParam + `&state=${orginState}`;
    const LeftPosition = window.screen.width ? (window.screen.width - 700) / 2 : 0;
    const TopPosition = window.screen.height ? (window.screen.height - 850) / 2 : 0;
    const settings = `height=700,width=600,top=${TopPosition},left=${LeftPosition},scrollbars=yes,resizable`;
    const popupWindow = window.open(url, winName, settings);

    try {
      popupWindow.onunload = function () {
        window.setTimeout(function () {
          if (popupWindow.closed) {
            document.cookie = `${domain}_FeedEnabled=${true}; path=/`;
            setFeedEnable(true);
            console.log(`Successfully authenticate to ${domain}`);
          }
        }, 1);
      };
    } catch (e) {
      alert("Another Authendicate popup window might already be open.");
      console.error("Another Authendicate popup window might already be open.");
      console.error("Auth Popup error:", e);
    }
  }

  async function disconnectTwitch() {
    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
        username: username,
        columnValue: "null",
        columnName: "TwitchToken",
      })
      .then(() => {
        document.cookie = `Twitch-access_token=null; path=/; SameSite=Lax`;
        document.cookie = `Twitch_FeedEnabled=${false}; path=/`;
        setTwitchToken(null);
        setEnableTwitch(false);
        setEnableTwitchVods(false);
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
        columnValue: "null",
        columnName: "YoutubeToken",
      })
      .then(() => {
        document.cookie = `Youtube-access_token=null; path=/`;
        document.cookie = `Youtube_FeedEnabled=null; path=/`;
        setYoutubeToken(null);
        setEnableYoutube(false);
        console.log(`Successfully disconnected from Youtube`);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <div>
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

      <h1 style={{ fontSize: "2rem", textAlign: "center" }} title='Username'>
        {username}
      </h1>
      <p style={{ textAlign: "center" }} title='Email'>
        {Util.getCookie("AioFeed_AccountEmail")}
      </p>
      <ToggleSwitch
        setEnable={setEnableTwitch}
        enabled={enableTwitch}
        label='Twitch'
        tokenExists={twitchToken}
      />
      <ToggleSwitch
        setEnable={setEnableTwitter}
        enabled={enableTwitter}
        label='Twitter'
        tokenExists={true}
        // tokenExists={twitterListName}
      />
      <UpdateTwitterListName />
      <ToggleSwitch
        setEnable={setEnableYoutube}
        enabled={enableYoutube}
        label='Youtube'
        tokenExists={youtubeToken}
      />
      <ToggleSwitch
        setEnable={setEnableTwitchVods}
        enabled={enableTwitchVods}
        label='TwitchVods'
        tokenExists={twitchToken}
      />
      <br />
      <ToggleSwitchAutoRefresh
        autoRefreshEnabled={autoRefreshEnabled}
        setAutoRefreshEnabled={setAutoRefreshEnabled}
        tokenExists={twitchToken}
      />
      <ToggleSwitchVideoHover
        enableHover={twitchVideoHoverEnable}
        setEnableHover={setTwitchVideoHoverEnable}
        feed='Twitch'
      />
      <ToggleSwitchVideoHover
        enableHover={youtubeVideoHoverEnable}
        setEnableHover={setYoutubeVideoHoverEnable}
        feed='Youtube'
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
            Connect Twitch
            <FaTwitch ize={24} style={{ marginLeft: "0.75rem" }} />
          </StyledConnectTwitch>
        </StyledConnectContainer>
      ) : (
        <StyledConnectContainer>
          <div id='username'>
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
            style={{ backgroundColor: "hsla(268, 77%, 15%, 1)" }}
            onClick={disconnectTwitch}>
            <FiLogOut size={24} />
          </StyledConnectTwitch>
        </StyledConnectContainer>
      )}
      {!youtubeToken ? (
        <div style={{ marginBottom: "10px", display: "flex" }}>
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
            Connect Youtube
            <FaYoutube size={24} style={{ marginLeft: "0.75rem" }} />
          </StyledConnectYoutube>
        </div>
      ) : (
        <div style={{ marginBottom: "10px", width: "280px" }}>
          <StyledConnectYoutube
            style={{ marginRight: "25px" }}
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
            <MdRefresh size={24} />
          </StyledConnectYoutube>
          <StyledConnectYoutube
            title='Disconnect'
            style={{ backgroundColor: "hsla(0, 65%, 10%, 1)" }}
            onClick={disconnectYoutube}>
            Disconnect Youtube
          </StyledConnectYoutube>
        </div>
      )}
      <Themeselector />

      <StyledLogoutContiner>
        <DeleteAccountButton />
        <Button style={{ width: "100%" }} label='logout' onClick={logout}>
          Logout
          <GoSignOut size={24} style={{ marginLeft: "0.75rem" }} />
        </Button>
      </StyledLogoutContiner>
    </div>
  );
};
