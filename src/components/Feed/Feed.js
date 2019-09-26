import React, { useState, useEffect } from "react";
import { Spinner, Alert } from "react-bootstrap";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Animated } from "react-animated-css";

//eslint-disable-next-line
import Youtube from "../youtube/Youtube";
import Twitch from "../twitch/Twitch";
import TwitchVods from "../twitch/Twitch-vods";
import ErrorHandeling from "./../error/Error";
//eslint-disable-next-line
import styles from "./Feed.module.scss";
import Utilities from "utilities/Utilities";

import "./Notifications.scss";

function Feed() {
  document.title = "Notifies | Feed";
  const [isLoaded] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    Notification.requestPermission().then(function(result) {
      console.log(result);
    });
  }, []);

  function NofeedsEnabled() {
    const [show, setShow] = useState(true);
    if (
      localStorage.getItem("TwitchFeedEnabled") === "false" &&
      localStorage.getItem("YoutubeFeedEnabled") === "false" &&
      localStorage.getItem("TwitchVodsFeedEnabled") === "false" &&
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

  if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else if (!isLoaded) {
    return (
      <Spinner animation='border' role='status' style={Utilities.loadingSpinner}>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  } else {
    return (
      <>
        <ReactNotification />
        <NofeedsEnabled></NofeedsEnabled>
        {localStorage.getItem("TwitchFeedEnabled") === "true" ? <Twitch /> : null}

        {localStorage.getItem("YoutubeFeedEnabled") === "true" ? <Youtube /> : null}
        {localStorage.getItem("TwitchVodsFeedEnabled") === "true" ? <TwitchVods /> : null}
      </>
    );
  }
}

export default Feed;
