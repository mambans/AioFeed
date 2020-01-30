import { Button } from "react-bootstrap";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import { ic_account_box } from "react-icons-kit/md/ic_account_box";
import { ic_refresh } from "react-icons-kit/md/ic_refresh";
import { Icon } from "react-icons-kit";
import { NavLink } from "react-router-dom";
import { out } from "react-icons-kit/entypo/out";
import { Redirect } from "react-router-dom";
import { twitch } from "react-icons-kit/icomoon/twitch";
import { youtube } from "react-icons-kit/icomoon/youtube";
import axios from "axios";
import Popup from "reactjs-popup";
import React, { useContext } from "react";
import uniqid from "uniqid";

import AccountContext from "./../account/AccountContext";
import FeedContext from "./../feed/FeedsContext";
import LoginModal from "../account/LoginModal";
import NavigationContext from "./../navigation/NavigationContext";
import styles from "./Account.module.scss";
import Themeselector from "./../themes/Themeselector";
import ToggleSwitch from "./ToggleSwitch";
import ToggleSwitchVideoHover from "./ToggleSwitchVideoHover";
import UpdateProfileImg from "./UpdateProfileImg";
import Utilities from "../../utilities/Utilities";

export default () => {
  document.title = "Notifies | Account";
  const { username, setTwitchToken, setYoutubeToken, twitchToken, youtubeToken } = useContext(
    AccountContext
  );
  const { isLoggedIn, setIsLoggedIn, setRenderModal } = useContext(NavigationContext);
  const {
    setEnableTwitch,
    enableTwitch,
    setEnableTwitchVods,
    enableTwitchVods,
    setEnableYoutube,
    enableYoutube,
    twitchVideoHoverEnable,
    setTwitchVideoHoverEnable,
    youtubeVideoHoverEnable,
    setYoutubeVideoHoverEnable,
  } = useContext(FeedContext);

  function logout() {
    document.cookie = `Notifies_AccountName=null; path=/`;
    document.cookie = `Notifies_AccountEmail=null; path=/`;
    document.cookie = `Twitch-access_token=null; path=/`;
    document.cookie = `Youtube-access_token=null; path=/`;
    document.cookie = `Notifies_AccountProfileImg=null; path=/`;

    setIsLoggedIn(false);
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
        document.cookie = `Twitch-access_token=null; path=/`;
        setTwitchToken(null);
        setEnableTwitch(false);
        setEnableTwitchVods(false);
        localStorage.setItem("TwitchFeedEnabled", false);
        localStorage.setItem("TwitchVodsFeedEnabled", false);
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
        setYoutubeToken(null);
        setEnableYoutube(false);
        localStorage.setItem("YoutubeFeedEnabled", false);
        console.log(`Successfully disconnected from Youtube`);
      })
      .catch(e => {
        console.error(e);
      });
  }

  return isLoggedIn ? (
    <div className={styles.accountContainer}>
      <div className={styles.profileContainer}>
        <img
          className={styles.profileImage}
          src={
            Utilities.getCookie("Notifies_AccountProfileImg") ||
            `${process.env.PUBLIC_URL}/images/placeholder.jpg`
          }
          alt=''></img>
        <Popup
          placeholder='Img url...'
          arrow={false}
          trigger={
            <Button variant='outline-secondary' className={styles.UpdateProfileImgButton}>
              Change Profile image
            </Button>
          }
          position='bottom center'
          className='updateProfilePopup'>
          <UpdateProfileImg />
        </Popup>
        <div className={styles.prefixs}>
          <p>Username:</p>
          <p>Email:</p>
        </div>
        <div className={styles.names}>
          <p>{Utilities.getCookie("Notifies_AccountName")}</p>
          <p>{Utilities.getCookie("Notifies_AccountEmail")}</p>
        </div>
      </div>
      <div className={styles.toggleContainer}>
        <ToggleSwitch
          setEnableTwitch={setEnableTwitch}
          setEnableTwitchVods={setEnableTwitchVods}
          setEnableYoutube={setEnableYoutube}
          enableTwitch={enableTwitch}
          enableTwitchVods={enableTwitchVods}
          enableYoutube={enableYoutube}
          label='Twitch'
          token='Twitch'
          tokenExists={twitchToken}
        />

        {!twitchToken ? (
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
            <Icon icon={twitch} size={24} style={{ paddingLeft: "0.75rem" }} />
          </Button>
        ) : (
          <div className={styles.connectContainer}>
            <p className={[styles.twitchConnected, styles.connected].join(" ")}>
              Connected to Twitch
              <Icon icon={checkmark} size={24} style={{ paddingLeft: "0.75rem" }} />
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
              <Icon icon={ic_refresh} size={24} />
            </Button>
            <Button className={styles.disconnectButton} onClick={disconnectTwitch}>
              Disconnect Twitch
            </Button>
          </div>
        )}
      </div>

      <div className={styles.toggleContainer}>
        <ToggleSwitch
          setEnableTwitch={setEnableTwitch}
          setEnableTwitchVods={setEnableTwitchVods}
          setEnableYoutube={setEnableYoutube}
          enableTwitch={enableTwitch}
          enableTwitchVods={enableTwitchVods}
          enableYoutube={enableYoutube}
          label='Youtube'
          token='Youtube'
          tokenExists={youtubeToken}
        />

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
            <Icon icon={youtube} size={24} style={{ paddingLeft: "0.75rem" }} />
          </Button>
        ) : (
          <div className={styles.connectContainer}>
            <p className={[styles.youtubeConnected, styles.connected].join(" ")}>
              Connected to Youtube
              <Icon icon={checkmark} size={24} style={{ paddingLeft: "0.75rem" }} />
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
              <Icon icon={ic_refresh} size={24} />
            </Button>
            <Button className={styles.disconnectButton} onClick={disconnectYoutube}>
              Disconnect Youtube
            </Button>
          </div>
        )}
      </div>
      <div className={styles.toggleContainer}>
        <ToggleSwitch
          setEnableTwitch={setEnableTwitch}
          setEnableTwitchVods={setEnableTwitchVods}
          setEnableYoutube={setEnableYoutube}
          enableTwitch={enableTwitch}
          enableTwitchVods={enableTwitchVods}
          enableYoutube={enableYoutube}
          label='TwitchVods'
          token='Twitch'
          tokenExists={twitchToken}
        />
      </div>

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

      <Themeselector />
      <div className={styles.lastButtonsContainer}>
        {window.location.href !==
        "http://notifies.mambans.com.s3-website.eu-north-1.amazonaws.com/account" ? (
          <Button
            className={[styles.notifiesLogoutButton, styles.disconnectButton].join(" ")}
            as={NavLink}
            to='/account'>
            Go to Account page
            <Icon icon={ic_account_box} size={24} style={{ paddingLeft: "0.75rem" }} />
          </Button>
        ) : null}
        <Button
          className={[styles.notifiesLogoutButton, styles.disconnectButton].join(" ")}
          onClick={logout}>
          Logout from Notifies
          <Icon icon={out} size={24} style={{ paddingLeft: "0.75rem" }} />
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
