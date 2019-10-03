import axios from "axios";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Redirect, NavLink } from "react-router-dom";
import Popup from "reactjs-popup";

//icons
import { Icon } from "react-icons-kit";
import { out } from "react-icons-kit/entypo/out";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import { twitch } from "react-icons-kit/icomoon/twitch";
import { youtube } from "react-icons-kit/icomoon/youtube";

import placeholder from "./../../assets/images/placeholder.png";
import SuccessfullyConnected from "./SuccessfullyConnected";
import styles from "./Account.module.scss";
import ToggleSwitch from "./ToggleSwitch";
import UpdateProfileImg from "./UpdateProfileImg";
import Utilities from "./../../utilities/Utilities";
// import UploadProfileImageForm from "./UploadProfileImage";

function NotifiesAccount(data) {
  document.title = "Notifies | Account";
  const [refresh, setRefresh] = useState(false);
  const [disableTwitch, setDisableTwitch] = useState(false);
  const [disableYoutube, setDisableYoutube] = useState(false);
  const [disableTwitchVods, setDisableTwitchVods] = useState(false);

  function logout() {
    document.cookie = `Notifies_AccountName=; path=/`;
    document.cookie = `Notifies_AccountEmail=; path=/`;
    document.cookie = `Twitch-access_token=null; path=/`;
    document.cookie = `Youtube-access_token=null; path=/`;

    // window.location.href = "/account/login";

    data.data.setRefresh(!data.data.refresh);
  }

  async function disconnectTwitch() {
    document.cookie = "Twitch-access_token=";
    await axios.put(`http://localhost:3100/notifies/account/twitch/connect`, {
      accountName: Utilities.getCookie("Notifies_AccountName"),
      accountEmail: Utilities.getCookie("Notifies_AccountEmail"),
      twitchToken: null,
    });

    refresh ? setRefresh(false) : setRefresh(true);
    setDisableTwitch(true);
    setDisableTwitchVods(true);
  }

  async function disconnectYoutube() {
    document.cookie = "Youtube-access_token=";
    await axios.put(`http://localhost:3100/notifies/account/youtube/connect`, {
      accountName: Utilities.getCookie("Notifies_AccountName"),
      accountEmail: Utilities.getCookie("Notifies_AccountEmail"),
      youtubeToken: null,
    });

    refresh ? setRefresh(false) : setRefresh(true);
    setDisableYoutube(true);
  }

  return (
    <>
      <SuccessfullyConnected />

      {Utilities.getCookie("Notifies_AccountName") ? (
        <div className={styles.accountContainer}>
          <div className={styles.profileContainer}>
            <img
              className={styles.profileImage}
              // src={placeholder}
              src={
                Utilities.getCookie("Notifies_AccountProfileImg") !== "null"
                  ? Utilities.getCookie("Notifies_AccountProfileImg")
                  : placeholder
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

          <ToggleSwitch
            data={{ label: "Twitch", token: "Twitch", disable: disableTwitch }}></ToggleSwitch>
          <ToggleSwitch
            data={{
              label: "Youtube",
              token: "Youtube",
              disable: disableYoutube,
            }}></ToggleSwitch>
          <ToggleSwitch
            data={{
              label: "TwitchVods",
              token: "Twitch",
              disable: disableTwitchVods,
            }}></ToggleSwitch>

          {Utilities.getCookie("Twitch-access_token") === "null" ? (
            <Button
              className={[styles.connectButtons, styles.connectTwitch].join(" ")}
              as={NavLink}
              to='/login'>
              Connect Twitch
              <Icon icon={twitch} size={24} style={{ paddingLeft: "0.75rem" }} />
            </Button>
          ) : (
            <div className={styles.connectContainer}>
              <p className={[styles.twitchConnected, styles.connected].join(" ")}>
                Connected to Twitch{" "}
                <Icon icon={checkmark} size={24} style={{ paddingLeft: "0.75rem" }} />
              </p>
              <Button
                className={[styles.connectButtons, styles.disconnectButton].join(" ")}
                onClick={disconnectTwitch}>
                Disconnect Twitch
              </Button>
            </div>
          )}
          {Utilities.getCookie("Youtube-access_token") === "null" ? (
            <Button
              className={[styles.connectButtons, styles.connectYoutube].join(" ")}
              as={NavLink}
              to='/youtube/login'>
              Connect Youtube
              <Icon icon={youtube} size={24} style={{ paddingLeft: "0.75rem" }} />
            </Button>
          ) : (
            <div className={styles.connectContainer}>
              <p className={[styles.youtubeConnected, styles.connected].join(" ")}>
                Connected to Youtube{" "}
                <Icon icon={checkmark} size={24} style={{ paddingLeft: "0.75rem" }} />
              </p>
              <Button
                className={[styles.connectButtons, styles.disconnectButton].join(" ")}
                onClick={disconnectYoutube}>
                Disconnect Youtube
              </Button>
            </div>
          )}
          <Button
            className={[styles.connectButtons, styles.disconnectButton].join(" ")}
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
