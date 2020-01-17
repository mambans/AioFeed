import { Button } from "react-bootstrap";
import { ic_account_box } from "react-icons-kit/md/ic_account_box";
import { ic_refresh } from "react-icons-kit/md/ic_refresh";
import { Icon } from "react-icons-kit";
import { NavLink } from "react-router-dom";
import { out } from "react-icons-kit/entypo/out";
import { twitch } from "react-icons-kit/icomoon/twitch";
import { youtube } from "react-icons-kit/icomoon/youtube";
import axios from "axios";
import Popup from "reactjs-popup";
import React, { useContext } from "react";
import uniqid from "uniqid";
import { exit } from "react-icons-kit/icomoon/exit";

import Themeselector from "./../../themes/Themeselector";
import ToggleSwitch from "../../account/ToggleSwitch";
import ToggleSwitchVideoHover from "../../account/ToggleSwitchVideoHover";
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

export default props => {
  document.title = "Notifies | Account";
  const {
    username,
    profileImage,
    twitchDisplayName,
    twitchProfileImg,
    setTwitchToken,
    setYoutubeToken,
    twitchToken,
    youtubeToken,
  } = useContext(AccountContext);

  function logout() {
    document.cookie = `Notifies_AccountName=null; path=/`;
    document.cookie = `Notifies_AccountEmail=null; path=/`;
    document.cookie = `Twitch-access_token=null; path=/`;
    document.cookie = `Youtube-access_token=null; path=/`;
    document.cookie = `Notifies_AccountProfileImg=null; path=/`;

    // localStorage.setItem("TwitchFeedEnabled", false);
    localStorage.setItem("YoutubeFeedEnabled", false);
    localStorage.setItem("TwitchVodsFeedEnabled", false);
    props.setIsLoggedIn(false);
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
        // window.setTimeout(function() {
        //   if (popupWindow.closed) {
        //     localStorage.setItem(domain + "FeedEnabled", true);
        //     setToken(true);
        //     setFeedEnable(true);
        //     if (setFeedEnableSecond) setFeedEnableSecond(true);
        //     console.log(`Successfully authenticate to ${domain}`);
        //   }
        // }, 1);
        console.log(`Successfully authenticate to ${domain}`);
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
        localStorage.setItem("TwitchFeedEnabled", false);
        localStorage.setItem("TwitchVodsFeedEnabled", false);
        setTwitchToken(null);
        props.setEnableTwitch(false);
        props.setEnableTwitchVods(false);
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
        props.setEnableYoutube(false);
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
        // src={
        //   Utilities.getCookie("Notifies_AccountProfileImg") ||
        //   `${process.env.PUBLIC_URL}/images/placeholder.jpg`
        // }
        alt=''
      />

      <h1 style={{ fontSize: "2rem", textAlign: "center" }} title='Username'>
        {/* {Utilities.getCookie("Notifies_AccountName")} */}
        {username}
      </h1>
      <p style={{ textAlign: "center" }} title='Email'>
        {Utilities.getCookie("Notifies_AccountEmail")}
      </p>
      <ToggleSwitch {...props} label='Twitch' token='Twitch' tokenExists={twitchToken} />
      <ToggleSwitch {...props} label='Youtube' token='Youtube' tokenExists={youtubeToken} />
      <ToggleSwitch {...props} label='TwitchVods' token='Twitch' tokenExists={twitchToken} />
      <br />
      <ToggleSwitchVideoHover
        enableHover={props.twitchVideoHoverEnable}
        setEnableHover={props.setTwitchVideoHoverEnable}
        feed='Twitch'
      />
      <ToggleSwitchVideoHover
        enableHover={props.youtubeVideoHoverEnable}
        setEnableHover={props.setYoutubeVideoHoverEnable}
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
                props.setEnableTwitch,
                props.setEnableTwitchVods
              );
            }}>
            Connect Twitch
            <Icon icon={twitch} size={24} style={{ paddingLeft: "0.75rem" }} />
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
                  props.setEnableTwitch,
                  props.setEnableTwitchVods
                );
              }}>
              <StyledReconnectIcon id='reconnectIcon' />
              <img title='Re-authenticate' src={twitchProfileImg} alt='' />
            </div>
            <p>{twitchDisplayName}</p>
          </div>
          <StyledConnectTwitch
            id='disconnect'
            title='Disconnect'
            style={{ backgroundColor: "hsla(268, 77%, 15%, 1)" }}
            onClick={disconnectTwitch}>
            <Icon icon={exit} size={24} />
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
                props.setEnableYoutube
              );
            }}>
            Connect Youtube
            <Icon icon={youtube} size={24} style={{ paddingLeft: "0.75rem" }} />
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
                props.setEnableYoutube
              );
            }}>
            <Icon icon={ic_refresh} size={24} />
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
            <Icon icon={ic_account_box} size={24} style={{ paddingLeft: "0.75rem" }} />
          </Button>
        ) : null}
        <Button style={{ width: "100%" }} label='logout' onClick={logout}>
          Logout
          <Icon icon={out} size={24} style={{ paddingLeft: "0.75rem" }} />
        </Button>
      </StyledLogoutContiner>
    </div>
  );
};
