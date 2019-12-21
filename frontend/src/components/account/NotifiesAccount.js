import Popup from "reactjs-popup";
import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { Icon } from "react-icons-kit";
import { NavLink } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import { ic_account_box } from "react-icons-kit/md/ic_account_box";
import { out } from "react-icons-kit/entypo/out";
import { twitch } from "react-icons-kit/icomoon/twitch";
import { youtube } from "react-icons-kit/icomoon/youtube";
import { ic_refresh } from "react-icons-kit/md/ic_refresh";
import uniqid from "uniqid";

import NotifiesLogin from "../account/NotifiesLogin";
import styles from "./Account.module.scss";
import Themeselector from "./../themes/Themeselector";
import ToggleSwitch from "./ToggleSwitch";
import ToggleSwitchVideoHover from "./ToggleSwitchVideoHover";
import UpdateProfileImg from "./UpdateProfileImg";
import Utilities from "../../utilities/Utilities";

function NotifiesAccount(props) {
  document.title = "Notifies | Account";

  function logout() {
    document.cookie = `Notifies_AccountName=null; path=/`;
    document.cookie = `Notifies_AccountEmail=null; path=/`;
    document.cookie = `Twitch-access_token=null; path=/`;
    document.cookie = `Youtube-access_token=null; path=/`;
    document.cookie = `Notifies_AccountProfileImg=null; path=/`;

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

      // return randomstring.generate({
      //   capitalization: "lowercase",
      //   length: 32,
      // });
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
      console.error("Another Authendicate popup window might already be open.");
      console.error("Auth Popup error:", e);
    }
  }

  async function disconnectTwitch() {
    document.cookie = "Twitch-access_token=null; path=/";

    await axios
      .put(`http://localhost:3100/notifies/account/twitch/connect`, {
        accountName: Utilities.getCookie("Notifies_AccountName"),
        accountEmail: Utilities.getCookie("Notifies_AccountEmail"),
        twitchToken: null,
      })
      .then(() => {
        document.cookie = `Twitch-access_token=null; path=/`;
        props.setTwitchToken(null);
        props.setEnableTwitch(false);
        props.setEnableTwitchVods(false);
        localStorage.setItem("TwitchFeedEnabled", false);
        localStorage.setItem("TwitchVodsFeedEnabled", false);
        console.log(`Successfully disconnected from Twitch`);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function disconnectYoutube() {
    document.cookie = "Youtube-access_token=null; path=/";

    await axios
      .put(`http://localhost:3100/notifies/account/youtube/connect`, {
        accountName: Utilities.getCookie("Notifies_AccountName"),
        accountEmail: Utilities.getCookie("Notifies_AccountEmail"),
        youtubeToken: null,
      })
      .then(() => {
        document.cookie = `Youtube-access_token=null; path=/`;
        props.setYoutubeToken(null);
        props.setEnableYoutube(false);
        localStorage.setItem("YoutubeFeedEnabled", false);
        console.log(`Successfully disconnected from Youtube`);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return props.isLoggedIn ? (
    <div className={styles.accountContainer}>
      <div className={styles.profileContainer}>
        <img
          className={styles.profileImage}
          src={
            Utilities.getCookie("Notifies_AccountProfileImg") ||
            `${process.env.PUBLIC_URL}/images/placeholder.png`
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
        <ToggleSwitch {...props} label='Twitch' token='Twitch' tokenExists={props.twitchToken} />

        {!props.twitchToken ? (
          <Button
            className={styles.connectTwitch}
            onClick={() => {
              authenticatePopup(
                `Connect Twitch`,
                "Twitch",
                `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/twitch/callback&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code`,
                props.setTwitchToken,
                props.setEnableTwitch,
                props.setEnableTwitchVods
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
                  `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/twitch/callback&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code`,
                  props.setTwitchToken,
                  props.setEnableTwitch,
                  props.setEnableTwitchVods
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
        <ToggleSwitch {...props} label='Youtube' token='Youtube' tokenExists={props.youtubeToken} />

        {!props.youtubeToken ? (
          <Button
            className={styles.connectYoutube}
            //to unfollow: scope=https://www.googleapis.com/auth/youtube
            //else  scope=https://www.googleapis.com/auth/youtube.readonly
            onClick={() => {
              authenticatePopup(
                `Connect Youtube`,
                "Youtube",
                `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/youtube/callback&response_type=token&scope=https://www.googleapis.com/auth/youtube.readonly`,
                props.setYoutubeToken,
                props.setEnableYoutube
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
                  `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/youtube/callback&response_type=token&scope=https://www.googleapis.com/auth/youtube.readonly`,
                  props.setYoutubeToken,
                  props.setEnableYoutube
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
          {...props}
          label='TwitchVods'
          token='Twitch'
          tokenExists={props.twitchToken}
        />
      </div>

      <div className={styles.toggleContainer}>
        <ToggleSwitchVideoHover
          enableHover={props.twitchVideoHoverEnable}
          setEnableHover={props.setTwitchVideoHoverEnable}
          feed='Twitch'
        />
      </div>

      <div className={styles.toggleContainer}>
        <ToggleSwitchVideoHover
          enableHover={props.youtubeVideoHoverEnable}
          setEnableHover={props.setYoutubeVideoHoverEnable}
          feed='Youtube'
        />
      </div>

      <Themeselector />
      <div className={styles.lastButtonsContainer}>
        {window.location.href !== "http://localhost:3000/account" ? (
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
          <NotifiesLogin />
          <Button
            className={styles.disconnectButton}
            onClick={() => {
              props.setRenderModal("create");
            }}>
            Create Account
          </Button>
        </>
      )}
    </div>
  );
}

export default NotifiesAccount;
