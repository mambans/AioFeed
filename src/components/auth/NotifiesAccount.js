import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Redirect, NavLink } from "react-router-dom";
import Popup from "reactjs-popup";

// import { Redirect } from "react-router-dom";

import SuccessfullyConnected from "./SuccessfullyConnected";
import styles from "./Auth.module.scss";
import Utilities from "./../../utilities/Utilities";
import placeholder from "./../../assets/images/placeholder.png";
// import UploadProfileImageForm from "./UploadProfileImage";

import ToggleSwitch from "./ToggleSwitch";

function NotifiesAccount() {
  const [refresh, setRefresh] = useState(false);
  document.title = "Notifies | Account";

  return (
    <>
      <SuccessfullyConnected />

      {Utilities.getCookie("Notifies_AccountName") ? (
        <div className={styles.accountContainer}>
          <div className={styles.profileContainer}>
            <img src={placeholder} alt=''></img>
            <div className={styles.prefixs}>
              <p>Username:</p>
              <p>Email:</p>
            </div>
            <div className={styles.names}>
              <p>{Utilities.getCookie("Notifies_AccountName")}</p>
              <p>{Utilities.getCookie("Notifies_AccountEmail")}</p>
            </div>
          </div>

          <ToggleSwitch data={{ label: "Twitch" }}></ToggleSwitch>
          <ToggleSwitch data={{ label: "Youtube" }}></ToggleSwitch>
          <ToggleSwitch data={{ label: "TwitchVods" }}></ToggleSwitch>

          {/* {!TwitchloggedIn ? <Button onClick={() => { */}
          {!Utilities.getCookie("Twitch-access_token") ? (
            <Button
              className={[styles.connectButtons, styles.connectTwitch].join(" ")}
              as={NavLink}
              to='/login'>
              Connect Twitch
            </Button>
          ) : (
            <div className={styles.connectContainer}>
              <p className={styles.twitchConnected}>Successfully connected to Twitch</p>
              <Button
                className={[styles.connectButtons, styles.connectYoutube].join(" ")}
                onClick={() => {
                  document.cookie = "Twitch-access_token=";
                  refresh ? setRefresh(false) : setRefresh(true);
                }}>
                Disconnect Twitch
              </Button>
            </div>
          )}
          {/* {!YoutubeloggedIn ? <Button onClick={() => { */}
          {!Utilities.getCookie("Youtube-access_token") ? (
            <Button
              className={[styles.connectButtons, styles.connectYoutube].join(" ")}
              as={NavLink}
              to='/youtube/login'>
              Connect Youtube
            </Button>
          ) : (
            <div className={styles.connectContainer}>
              <p className={styles.youtubeConnected}>Successfully connected to Youtube</p>
              <Button
                className={[styles.connectButtons, styles.connectYoutube].join(" ")}
                onClick={() => {
                  document.cookie = "Youtube-access_token=";
                  refresh ? setRefresh(false) : setRefresh(true);
                }}>
                Disconnect Youtube
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Redirect to='/account/login'></Redirect>
      )}
      {false ? (
        <Popup
          placeholder='Image..'
          trigger={
            <Button
              variant='outline-secondary'
              // className={styles.settings}
            >
              Upload image
            </Button>
          }
          position='right center'
          className='settingsPopup'>
          {/* <UploadProfileImageForm></UploadProfileImageForm> */}
        </Popup>
      ) : null}
      <Button
        className={[styles.connectButtons, styles.connectYoutube].join(" ")}
        onClick={() => {
          document.cookie = `Notifies_AccountName=; path=/`;
          document.cookie = `Notifies_AccountEmail=; path=/`;
          document.cookie = `Twitch-access_token=; path=/`;
          document.cookie = `Youtube-access_token=; path=/`;

          window.location.href = "/account/login";
        }}
        // as={NavLink}
        // to='/account/login'
      >
        Logout from Notifies
      </Button>
    </>
  );
}

export default NotifiesAccount;
