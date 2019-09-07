import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

//eslint-disable-next-line
import Youtube from "../Youtube/Youtube";
import Twitch from "../Twitch/Twitch";
import TwitchVods from "../Twitch/Twitch-vods";
import ErrorHandeling from "./../Error/Error";
import styles from "./Feed.module.scss";
import Utilities from "utilities/utilities";

function Feed() {
  const [isLoaded, setIsloaded] = useState(true);
  const [error, setError] = useState(null);

  if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else if (!isLoaded) {
    return (
      <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  } else {
    return (
      <>
        <ReactNotification />

        <Twitch />
        <div className={styles.lineBreak} />
        <Youtube />
        <div className={styles.lineBreak} />
        <TwitchVods />
      </>
    );
  }
}

export default Feed;
