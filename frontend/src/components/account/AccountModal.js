import { Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Redirect } from "react-router-dom";
import axios from "axios";
import React, { useContext, useState } from "react";
import uniqid from "uniqid";

import { FiLogOut } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";
import { MdRefresh } from "react-icons/md";
import { FaTwitch } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";

import { AccountContext } from "./../account/AccountContext";
import { FeedsContext } from "./../feed/FeedsContext";
import LoginModal from "../account/LoginModal";
import { NavigationContext } from "./../navigation/NavigationContext";
import styles from "./Account.module.scss";
import Themeselector from "./../themes/Themeselector";
import ToggleSwitch from "./../navigation/sidebar/ToggleSwitch";
import ToggleSwitchVideoHover from "./../navigation/sidebar/ToggleSwitchVideoHover";
import UpdateProfileImg from "./../navigation/sidebar/UpdateProfileImg";
import Util from "../../util/Util";
import ToggleSwitchAutoRefresh from "./../navigation/sidebar/ToggleSwitchAutoRefresh";

import {
  StyledProfileImg,
  StyledConnectTwitch,
  StyledConnectYoutube,
  ShowAddFormBtn,
  StyledConnectContainer,
  StyledReconnectIcon,
  CloseAddFormBtn,
} from "./../navigation/sidebar/StyledComponent";

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
  const { setRenderModal } = useContext(NavigationContext);
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
  const [showAddImage, setShowAddImage] = useState(false);

  function logout() {
    document.cookie = `Notifies_AccountName=null; path=/`;
    document.cookie = `Notifies_AccountEmail=null; path=/`;
    document.cookie = `Twitch-access_token=null; path=/; SameSite=Lax`;
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
            localStorage.setItem(domain + "FeedEnabled", true);
            console.log(`Successfully authenticate to ${domain}`);
          }
        }, 1);
      };
    } catch (e) {
      alert("Another Authendicate popup window might already be open.");
      console.error("Another Authendicate popup window might already be open in the background.");
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
        document.cookie = `Twitch-access_token=null; path=/; SameSite=Lax`;
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

  return username ? (
    <div className={styles.accountContainer}>
      <div className={styles.profileContainer}>
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
        {showAddImage ? <UpdateProfileImg /> : null}
        <StyledProfileImg
          src={profileImage || `${process.env.PUBLIC_URL}/images/placeholder.jpg`}
          alt=''
        />
        <div className={styles.prefixs}>
          <p>Username:</p>
          <p>Email:</p>
        </div>
        <div className={styles.names}>
          <p>{username}</p>
          <p>{Util.getCookie("Notifies_AccountEmail")}</p>
        </div>
      </div>
      <div className={styles.toggleContainer}>
        <ToggleSwitch
          setEnable={setEnableTwitch}
          enabled={enableTwitch}
          label='Twitch'
          tokenExists={twitchToken}
        />
      </div>

      <div className={styles.toggleContainer}>
        <ToggleSwitch
          setEnable={setEnableTwitchVods}
          enabled={enableTwitchVods}
          label='TwitchVods'
          tokenExists={twitchToken}
        />
      </div>
      <div className={styles.toggleContainer}>
        <ToggleSwitch
          setEnable={setEnableYoutube}
          enabled={enableYoutube}
          label='Youtube'
          tokenExists={youtubeToken}
        />
      </div>
      <br />
      <ToggleSwitchAutoRefresh
        autoRefreshEnabled={autoRefreshEnabled}
        setAutoRefreshEnabled={setAutoRefreshEnabled}
        tokenExists={twitchToken}
      />

      <div className={styles.toggleContainer}>
        <ToggleSwitchVideoHover
          enableHover={twitchVideoHoverEnable}
          setEnableHover={setTwitchVideoHoverEnable}
          feed='Twitch'
        />
      </div>

      <div className={styles.toggleContainer}>
        <ToggleSwitchVideoHover
          enableHover={youtubeVideoHoverEnable}
          setEnableHover={setYoutubeVideoHoverEnable}
          feed='Youtube'
        />
      </div>
      <br />
      {/* {!twitchToken ? (
        <Button
          className={styles.connectTwitch}
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
          Connect Twitch
          <FaTwitch size={24} style={{ marginLeft: "0.75rem" }} />
        </Button>
      ) : (
        <div className={styles.connectContainer}>
          <p className={[styles.twitchConnected, styles.connected].join(" ")}>
            Connected to Twitch
            <GoSignOut size={24} style={{ marginLeft: "0.75rem" }} />
          </p>
          <Button
            className={styles.connectTwitch}
            style={{ margin: "0 25px" }}
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
            <MdRefresh size={24} />
          </Button>
          <Button className={styles.disconnectButton} onClick={disconnectTwitch}>
            Disconnect Twitch
          </Button>
        </div>
      )}

      {!youtubeToken ? (
        <Button
          className={styles.connectYoutube}
          //to unfollow: scope=https://www.googleapis.com/auth/youtube
          //else  scope=https://www.googleapis.com/auth/youtube.readonly
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
        </Button>
      ) : (
        <div className={styles.connectContainer}>
          <p className={[styles.youtubeConnected, styles.connected].join(" ")}>
            Connected to Youtube
            <IoMdCheckmark size={24} style={{ paddingLeft: "0.75rem" }} />
          </p>
          <Button
            className={styles.connectYoutube}
            style={{ margin: "0 25px" }}
            //to unfollow: scope=https://www.googleapis.com/auth/youtube
            //else  scope=https://www.googleapis.com/auth/youtube.readonly
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
          </Button>
          <Button className={styles.disconnectButton} onClick={disconnectYoutube}>
            Disconnect Youtube
          </Button>
        </div>
      )} */}
      {!twitchToken ? (
        <StyledConnectContainer style={{ width: "250px" }}>
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
        <StyledConnectContainer style={{ width: "250px" }}>
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
            disabled
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
      <div className={styles.lastButtonsContainer}>
        {window.location.href !==
        "http://notifies.mambans.com.s3-website.eu-north-1.amazonaws.com/account" ? (
          <Button
            className={[styles.notifiesLogoutButton, styles.disconnectButton].join(" ")}
            as={NavLink}
            to='/account'>
            Go to Account page
            <MdAccountCircle size={24} style={{ marginLeft: "0.75rem" }} />
          </Button>
        ) : null}
        <Button
          className={[styles.notifiesLogoutButton, styles.disconnectButton].join(" ")}
          onClick={logout}>
          Logout from Notifies
          <GoSignOut size={24} style={{ marginLeft: "0.75rem" }} />
        </Button>
      </div>
    </div>
  ) : (
    <div className={styles.createAccountContainer}>
      {new URL(window.location.href).pathname === "/account" ? (
        <Redirect to='/account/login' />
      ) : (
        <>
          <LoginModal />
          <Button
            className={styles.disconnectButton}
            onClick={() => {
              setRenderModal("create");
            }}>
            Create Account
          </Button>
        </>
      )}
    </div>
  );
};
