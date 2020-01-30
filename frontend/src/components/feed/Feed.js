import "react-notifications-component/dist/theme.css";
import React, { useState, useEffect, useContext } from "react";
import ReactNotification from "react-notifications-component";
import { Alert } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";

// import "./Notifications.scss";
import DataHandler from "../twitch/DataHandler";
import ErrorHandeling from "./../error/Error";
import Twitch from "../twitch/Twitch";
import TwitchVods from "../twitch/vods/Twitch-vods";
import Utilities from "../../utilities/Utilities";
import Youtube from "./../youtube/Youtube";
import YoutubeDataHandler from "./../youtube/Datahandler";
import YoutubeHeader from "./../youtube/Header";
import styles from "./Feed.module.scss";
import LoadingIndicator from "./../LoadingIndicator";

import NavigationContext from "./../navigation/NavigationContext";
import FeedContext from "./FeedsContext";

export default function Feed() {
  document.title = "Notifies | Feed";
  const { isLoggedIn } = useContext(NavigationContext);
  const { enableTwitch, enableYoutube, enableTwitchVods } = useContext(FeedContext);
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
    const FEEDDELAY = 2500;

    window.setTimeout(
      () => {
        setDelayedEnableYoutube("true");
      },
      localStorage.getItem("TwitchFeedEnabled") === "true" ? FEEDDELAY : 0
    );

    window.setTimeout(
      () => {
        setDelayedEnableTwitchVods("true");
      },
      localStorage.getItem("YoutubeFeedEnabled") === "true" ? FEEDDELAY * 2 : FEEDDELAY
    );
  }, []);

  function NoFeedsEnabled() {
    const [show, setShow] = useState(true);

    if (
      localStorage.getItem("TwitchFeedEnabled") === "false" &&
      localStorage.getItem("YoutubeFeedEnabled") === "false" &&
      localStorage.getItem("TwitchVodsFeedEnabled") === "false" &&
      isLoggedIn &&
      show
    ) {
      return (
        <CSSTransition in={true} timeout={1000} classNames='fade-1s' unmountOnExit>
          <Alert
            variant='info'
            style={Utilities.feedAlertWarning}
            onClose={() => setShow(false)}
            dismissible>
            <Alert.Heading>No feeds are enabled</Alert.Heading>
            <hr />
            Please enable some feeds in account settings
          </Alert>
        </CSSTransition>
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
      <LoadingIndicator
        height={250}
        width={250}
        style={{ height: "80vh", alignContent: "center" }}
      />
    );
  } else {
    return (
      <>
        <ReactNotification />
        <NoFeedsEnabled />

        {enableTwitch ? (
          <DataHandler>
            {liveStreams => (
              <CSSTransition in={enableTwitch} timeout={0} classNames='fade-1s' unmountOnExit>
                <div className={styles.twitchContainer}>
                  <Twitch data={liveStreams} />
                </div>
              </CSSTransition>
            )}
          </DataHandler>
        ) : null}

        {enableYoutube && delayedEnableYoutube ? (
          <div className={styles.container}>
            <YoutubeDataHandler>
              {data => (
                <>
                  <YoutubeHeader
                    refresh={data.refresh}
                    isLoaded={data.isLoaded}
                    requestError={data.requestError}
                    followedChannels={data.followedChannels}
                  />
                  {data.error ? <ErrorHandeling data={data.error}></ErrorHandeling> : null}
                  <Youtube
                    requestError={data.requestError}
                    videos={data.videos}
                    initiated={data.initiated}
                  />
                </>
              )}
            </YoutubeDataHandler>
          </div>
        ) : null}

        {enableTwitchVods && delayedEnableTwitchVods ? (
          <div className={styles.container}>
            <TwitchVods />
          </div>
        ) : null}
      </>
    );
  }
}
