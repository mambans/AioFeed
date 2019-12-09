import "react-notifications-component/dist/theme.css";
import React, { useState, useEffect } from "react";
import ReactNotification from "react-notifications-component";
import { Animated } from "react-animated-css";
import { Spinner, Alert } from "react-bootstrap";

import "./Notifications.scss";
import DataHandler from "../twitch/DataHandler";
import ErrorHandeling from "./../error/Error";
import NotificationsContext from "./../notifications/NotificationsContext";
import Twitch from "../twitch/Twitch";
import TwitchVods from "../twitch/vods/Twitch-vods";
import Utilities from "../../utilities/Utilities";
import Youtube from "./../youtube/Youtube";
import YoutubeDataHandler from "./../youtube/Datahandler";
import YoutubeHeader from "./../youtube/Header";
import styles from "./Feed.module.scss";

function Feed(props) {
  // console.log("TCL: Feed -> props", props);
  document.title = "Notifies | Feed";
  const [isLoaded] = useState(true);
  const [error] = useState(null);
  const [delayedEnableYoutube, setDelayedEnableYoutube] = useState(false);
  const [delayedEnableTwitchVods, setDelayedEnableTwitchVods] = useState(false);

  useEffect(() => {
    Notification.requestPermission().then(function(result) {
      console.log("Notifications: ", result);
    });
  }, []);

  useEffect(() => {
    console.log("Feed UseEffect()");
  }, []);

  useEffect(() => {
    const TIMEOUT = 1000;

    window.setTimeout(
      () => {
        setDelayedEnableYoutube("true");
      },
      localStorage.getItem("TwitchFeedEnabled") === "true" ? TIMEOUT : 0
    );

    window.setTimeout(
      () => {
        setDelayedEnableTwitchVods("true");
      },
      localStorage.getItem("YoutubeFeedEnabled") === "true" ? TIMEOUT * 3 : TIMEOUT
    );
  }, []);

  function NoFeedsEnabled() {
    const [show, setShow] = useState(true);
    if (
      localStorage.getItem("TwitchFeedEnabled") === "false" &&
      localStorage.getItem("YoutubeFeedEnabled") === "false" &&
      localStorage.getItem("TwitchVodsFeedEnabled") === "false" &&
      props.isLoggedIn &&
      show
    ) {
      return (
        <Animated
          animationIn='fadeIn'
          animationOut='fadeOut'
          isVisible={true}
          animationInDuration={500}>
          <Alert
            variant='info'
            style={Utilities.feedAlertWarning}
            onClose={() => setShow(false)}
            dismissible>
            <Alert.Heading>No feeds are enabled</Alert.Heading>
            <hr />
            Please enable some feeds in account settings
          </Alert>
        </Animated>
      );
    }
    return null;
  }

  if (!Utilities.getCookie("Notifies_AccountName")) {
    return (
      <>
        <ErrorHandeling
          data={{
            title: "Please login",
            message: "You are not logged with your Notifies account.",
          }}></ErrorHandeling>
      </>
    );
  } else if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else if (!isLoaded) {
    return (
      <Spinner animation='grow' role='status' style={Utilities.loadingSpinner} variant='light'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  } else {
    return (
      <>
        <ReactNotification />
        <NoFeedsEnabled />

        {props.enableTwitch ? (
          <NotificationsContext.Consumer>
            {prop => {
              return (
                <DataHandler addNotification={prop.addNotification}>
                  {liveStreams => (
                    <div className={styles.twitchContainer}>
                      <Animated animationIn='fadeIn' animationOut='fadeOut' isVisible={true}>
                        <Twitch data={liveStreams} />
                      </Animated>
                    </div>
                  )}
                </DataHandler>
              );
            }}
          </NotificationsContext.Consumer>
        ) : null}

        {props.enableYoutube && delayedEnableYoutube ? (
          <div className={styles.container}>
            <YoutubeDataHandler>
              {data => (
                <Animated
                  animationIn='fadeIn'
                  animationOut='fadeOut'
                  isVisible={true}
                  style={{
                    width: "100%",
                  }}>
                  <YoutubeHeader
                    refresh={data.refresh}
                    isLoaded={data.isLoaded}
                    requestError={data.requestError}
                    followedChannels={data.followedChannels}
                  />
                  {data.error ? <ErrorHandeling data={data.error}></ErrorHandeling> : null}
                  <Youtube
                    isLoaded={data.isLoaded}
                    refresh={data.refresh}
                    requestError={data.requestError}
                    initiated={data.initiated}
                    followedChannels={data.followedChannels}
                    videos={data.videos}
                    onChange={data.onChange}
                  />
                </Animated>
              )}
            </YoutubeDataHandler>
          </div>
        ) : null}

        {props.enableTwitchVods && delayedEnableTwitchVods ? (
          <div className={styles.container}>
            <Animated
              animationIn='fadeIn'
              animationOut='fadeOut'
              isVisible={true}
              style={{ width: "100%" }}>
              <TwitchVods />
            </Animated>
          </div>
        ) : null}
      </>
    );
  }
}

export default Feed;
