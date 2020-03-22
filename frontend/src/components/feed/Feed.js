import { Alert } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import React, { useState, useEffect, useContext } from "react";

import DataHandler from "../twitch/DataHandler";
import ErrorHandeling from "./../error/Error";
import FeedsContext from "./FeedsContext";
import styles from "./Feed.module.scss";
import Twitch from "../twitch/Twitch";
import TwitchVods from "../twitch/vods/Twitch-vods";
import Util from "../../util/Util";
import Youtube from "./../youtube/Youtube";
import YoutubeDataHandler from "./../youtube/Datahandler";
import YoutubeHeader from "./../youtube/Header";
import AccountContext from "./../account/AccountContext";

export default function Feed() {
  document.title = "Notifies | Feed";
  const { enableTwitch, enableYoutube, enableTwitchVods } = useContext(FeedsContext);
  const { username } = useContext(AccountContext);
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
      enableTwitch ? FEEDDELAY : 0
    );

    window.setTimeout(
      () => {
        setDelayedEnableTwitchVods("true");
      },
      enableYoutube ? FEEDDELAY * 2 : FEEDDELAY
    );
  }, [enableTwitch, enableYoutube]);

  if (!username) {
    return (
      <>
        <ErrorHandeling
          data={{
            title: "Please login",
            message: "You are not logged with your Notifies account.",
          }}></ErrorHandeling>
      </>
    );
  } else if (!enableTwitch && !enableYoutube && !enableTwitchVods && username) {
    return (
      <CSSTransition in={true} timeout={1000} classNames='fade-1s' unmountOnExit>
        <Alert variant='info' style={Util.feedAlertWarning}>
          <Alert.Heading>No feeds are enabled</Alert.Heading>
          <hr />
          Please enable some feeds in account settings
        </Alert>
      </CSSTransition>
    );
  } else {
    return (
      <>
        {enableTwitch ? (
          <DataHandler>
            {data => (
              <CSSTransition in={enableTwitch} timeout={0} classNames='fade-1s' unmountOnExit>
                <div className={styles.twitchContainer}>
                  <Twitch data={data} />
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
