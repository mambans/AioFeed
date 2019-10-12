import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Redirect, NavLink } from "react-router-dom";
import Popup from "reactjs-popup";

//icons
import { Icon } from "react-icons-kit";
import { out } from "react-icons-kit/entypo/out";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import { twitch } from "react-icons-kit/icomoon/twitch";
import { youtube } from "react-icons-kit/icomoon/youtube";

import placeholder from "../../assets/images/placeholder.png";
import SuccessfullyConnected from "./SuccessfullyConnected";
import styles from "./Account.module.scss";
import ToggleSwitch from "./ToggleSwitch";
import ToggleSwitchVideoHover from "./ToggleSwitchVideoHover";
import UpdateProfileImg from "./UpdateProfileImg";
import Utilities from "../../utilities/Utilities";

function NotifiesAccount(data) {
  document.title = "Notifies | Account";
  const [refresh, setRefresh] = useState(false);
  const [disableTwitch, setDisableTwitch] = useState(false);
  const [disableYoutube, setDisableYoutube] = useState(false);
  const [disableTwitchVods, setDisableTwitchVods] = useState(false);
  const [refreshStartValue] = useState(data.data.refresh);

  function logout() {
    document.cookie = `Notifies_AccountName=; path=/`;
    document.cookie = `Notifies_AccountEmail=; path=/`;
    document.cookie = `Twitch-access_token=null; path=/`;
    document.cookie = `Youtube-access_token=null; path=/`;

    data.data.setRefresh(!data.data.refresh);
  }

  async function disconnectTwitch() {
    document.cookie = "Twitch-access_token=null";
    await axios
      .put(`http://localhost:3100/notifies/account/twitch/connect`, {
        accountName: Utilities.getCookie("Notifies_AccountName"),
        accountEmail: Utilities.getCookie("Notifies_AccountEmail"),
        twitchToken: null,
      })
      .then(() => {
        // refresh ? setRefresh(false) : setRefresh(true);
        setRefresh(!refresh);
        setDisableTwitch(true);
        setDisableTwitchVods(true);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function disconnectYoutube() {
    document.cookie = "Youtube-access_token=null";
    await axios
      .put(`http://localhost:3100/notifies/account/youtube/connect`, {
        accountName: Utilities.getCookie("Notifies_AccountName"),
        accountEmail: Utilities.getCookie("Notifies_AccountEmail"),
        youtubeToken: null,
      })
      .then(() => {
        setRefresh(!refresh);
        // localStorage.setItem("YoutubeFeedEnabled", false);

        setDisableYoutube(true);
      })
      .catch(error => {
        console.error(error);
      });
  }

  useEffect(() => {
    data.data.setRefresh(!refreshStartValue);
  }, [data.data, refreshStartValue]);

  return (
    <>
      <SuccessfullyConnected />

      {Utilities.getCookie("Notifies_AccountName") ? (
        <div className={styles.accountContainer}>
          <div className={styles.profileContainer}>
            <img
              className={styles.profileImage}
              src={
                Utilities.getCookie("Notifies_AccountProfileImg") === null ||
                Utilities.getCookie("Notifies_AccountProfileImg") === "null"
                  ? placeholder
                  : Utilities.getCookie("Notifies_AccountProfileImg")
              }
              alt=''></img>
            <Popup
              placeholder='Img url...'
              trigger={
                <Button variant='outline-secondary' className={styles.UpdateProfileImgButton}>
                  Change Profile image
                </Button>
              }
              position='bottom center'
              className='updateProfilePopup'>
              <UpdateProfileImg data={data}></UpdateProfileImg>
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
              data={{
                label: "Twitch",
                token: "Twitch",
                disable: disableTwitch,
                refresh,
              }}></ToggleSwitch>
            {Utilities.getCookie("Twitch-access_token") === null ||
            Utilities.getCookie("Twitch-access_token") === "null" ? (
              <Button className={styles.connectTwitch} as={NavLink} to='/auth/twitch'>
                Connect Twitch
                <Icon icon={twitch} size={24} style={{ paddingLeft: "0.75rem" }} />
              </Button>
            ) : (
              <div className={styles.connectContainer}>
                <p className={[styles.twitchConnected, styles.connected].join(" ")}>
                  Connected to Twitch{" "}
                  <Icon icon={checkmark} size={24} style={{ paddingLeft: "0.75rem" }} />
                </p>
                <Button className={styles.disconnectButton} onClick={disconnectTwitch}>
                  Disconnect Twitch
                </Button>
              </div>
            )}
          </div>
          <div className={styles.toggleContainer}>
            <ToggleSwitch
              data={{
                label: "TwitchVods",
                token: "Twitch",
                disable: disableTwitchVods,
                refresh,
              }}></ToggleSwitch>
          </div>

          <div className={styles.toggleContainer}>
            <ToggleSwitch
              data={{
                label: "Youtube",
                token: "Youtube",
                disable: disableYoutube,
                refresh,
              }}></ToggleSwitch>
            {Utilities.getCookie("Youtube-access_token") === null ||
            Utilities.getCookie("Youtube-access_token") === "null" ? (
              <Button className={styles.connectYoutube} as={NavLink} to='/auth/youtube'>
                Connect Youtube
                <Icon icon={youtube} size={24} style={{ paddingLeft: "0.75rem" }} />
              </Button>
            ) : (
              <div className={styles.connectContainer}>
                <p className={[styles.youtubeConnected, styles.connected].join(" ")}>
                  Connected to Youtube{" "}
                  <Icon icon={checkmark} size={24} style={{ paddingLeft: "0.75rem" }} />
                </p>
                <Button className={styles.disconnectButton} onClick={disconnectYoutube}>
                  Disconnect Youtube
                </Button>
              </div>
            )}
          </div>

          <div className={styles.toggleContainer}>
            <ToggleSwitchVideoHover
              data={{
                feed: "Twitch",
                refresh,
              }}></ToggleSwitchVideoHover>
          </div>

          <div className={styles.toggleContainer}>
            <ToggleSwitchVideoHover
              data={{
                feed: "Youtube",
                refresh,
              }}></ToggleSwitchVideoHover>
          </div>

          <Button
            className={[styles.notifiesLogoutButton, styles.disconnectButton].join(" ")}
            onClick={logout}>
            Logout from Notifies
            <Icon icon={out} size={24} style={{ paddingLeft: "0.75rem" }} />
          </Button>
        </div>
      ) : (
        <Redirect to='/account/login'></Redirect>
      )}
    </>
  );
}

export default NotifiesAccount;
