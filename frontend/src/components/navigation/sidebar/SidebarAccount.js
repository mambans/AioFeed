import { Button } from "react-bootstrap";
import { MdAccountCircle } from "react-icons/md";
import { MdRefresh } from "react-icons/md";
import { FaTwitch } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { FiLogOut } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Popup from "reactjs-popup";
import React, { useContext } from "react";
import uniqid from "uniqid";

import Themeselector from "./../../themes/Themeselector";
import ToggleSwitch from "../../account/ToggleSwitch";
import ToggleSwitchVideoHover from "../../account/ToggleSwitchVideoHover";
import ToggleSwitchAutoRefresh from "../../account/ToggleSwitchAutoRefresh";
import UpdateProfileImg from "../../account/UpdateProfileImg";
import Utilities from "../../../utilities/Utilities";
import {
  StyledProfileImg,
  StyledConnectTwitch,
  StyledConnectYoutube,
  StyledLogoutContiner,
  StyledUploadImageButon,
  StyledConnectContainer,
  StyledReconnectIcon,
} from "./StyledComponent";
import AccountContext from "./../../account/AccountContext";
import DeleteAccountButton from "./DeleteAccountButton";
import FeedsContext from "./../../feed/FeedsContext";

export default () => {
  document.title = "Notifies | Account";
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
  } = useContext(FeedsContext);

  function logout() {
    document.cookie = `Notifies_AccountName=null; path=/`;
    document.cookie = `Notifies_AccountEmail=null; path=/`;
    document.cookie = `Twitch-access_token=null; path=/`;
    document.cookie = `Youtube-access_token=null; path=/`;
    document.cookie = `Notifies_AccountProfileImg=null; path=/`;

    localStorage.setItem("YoutubeFeedEnabled", false);
    localStorage.setItem("TwitchVodsFeedEnabled", false);

    setUsername();
    setProfileImage();
    setAuthKey();
  }

  async function authenticatePopup(
    winName,
    domain,
    urlParam,
    setToken,
    setFeedEnable,
    setFeedEnableSecond
  ) {
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
      popupWindow.onunload = function() {
        window.setTimeout(function() {
          if (popupWindow.closed) {
            localStorage.setItem(domain + "FeedEnabled", true);
            setToken(true);
            setFeedEnable(true);
            if (setFeedEnableSecond) setFeedEnableSecond(true);
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
      .put(`https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
        username: username,
        token: "null",
        tokenName: "TwitchToken",
      })
      .then(() => {
        document.cookie = `Twitch-access_token=null; path=/`;
        document.cookie = `Twitch_feedEnabled=${false}; path=/`;
        localStorage.setItem("TwitchVodsFeedEnabled", false);
        setTwitchToken(null);
        setEnableTwitch(false);
        setEnableTwitchVods(false);
        console.log(`Successfully disconnected from Twitch`);
      })
      .catch(e => {
        console.error(e);
      });
  }

  async function disconnectYoutube() {
    await axios
      .put(`https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
        username: username,
        token: "null",
        tokenName: "YoutubeToken",
      })
      .then(() => {
        document.cookie = `Youtube-access_token=null; path=/`;
        localStorage.setItem("YoutubeFeedEnabled", false);
        setYoutubeToken(null);
        setEnableYoutube(false);
        console.log(`Successfully disconnected from Youtube`);
      })
      .catch(e => {
        console.error(e);
      });
  }

  return (
    <div>
      <Popup
        placeholder='Img url...'
        arrow={false}
        trigger={<StyledUploadImageButon>Change Profile image</StyledUploadImageButon>}
        position='bottom center'
        className='updateProfilePopup'>
        <UpdateProfileImg />
      </Popup>
      <StyledProfileImg
        src={profileImage || `${process.env.PUBLIC_URL}/images/placeholder.jpg`}
        alt=''
      />

      <h1 style={{ fontSize: "2rem", textAlign: "center" }} title='Username'>
        {username}
      </h1>
      <p style={{ textAlign: "center" }} title='Email'>
        {Utilities.getCookie("Notifies_AccountEmail")}
      </p>
      <ToggleSwitch
        setEnable={setEnableTwitch}
        enabled={enableTwitch}
        label='Twitch'
        tokenExists={twitchToken}
      />
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
                `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=http://notifies.mambans.com.s3-website.eu-north-1.amazonaws.com/auth/twitch/callback&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code&force_verify=true`,
                setTwitchToken,
                setEnableTwitch,
                setEnableTwitchVods
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
                  `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=http://notifies.mambans.com.s3-website.eu-north-1.amazonaws.com/auth/twitch/callback&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code`,
                  setTwitchToken,
                  setEnableTwitch,
                  setEnableTwitchVods
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
        <div style={{ marginBottom: "10px" }}>
          <StyledConnectYoutube
            //to unfollow: scope=https://www.googleapis.com/auth/youtube
            //else  scope=https://www.googleapis.com/auth/youtube.readonly
            title='Authenticate/Connect'
            onClick={() => {
              authenticatePopup(
                `Connect Youtube`,
                "Youtube",
                `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://notifies.mambans.com.s3-website.eu-north-1.amazonaws.com/auth/youtube/callback&response_type=token&scope=https://www.googleapis.com/auth/youtube.readonly`,
                setYoutubeToken,
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
                `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://notifies.mambans.com.s3-website.eu-north-1.amazonaws.com/auth/youtube/callback&response_type=token&scope=https://www.googleapis.com/auth/youtube.readonly`,
                setYoutubeToken,
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
        {window.location.href !==
        "http://notifies.mambans.com.s3-website.eu-north-1.amazonaws.com/account" ? (
          <Button label='linkAsButton' style={{ width: "100%" }} as={NavLink} to='/account'>
            Account page
            <MdAccountCircle size={24} style={{ marginLeft: "0.75rem" }} />
          </Button>
        ) : null}
        <Button style={{ width: "100%" }} label='logout' onClick={logout}>
          Logout
          <GoSignOut size={24} style={{ marginLeft: "0.75rem" }} />
        </Button>
      </StyledLogoutContiner>
    </div>
  );
};
