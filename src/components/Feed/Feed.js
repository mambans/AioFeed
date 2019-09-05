import Alert from "react-bootstrap/Alert";
import React from "react";
import Spinner from "react-bootstrap/Spinner";

import styles from "./Feed.module.scss";
import Utilities from "utilities/utilities";

//eslint-disable-next-line
import Youtube from "../Youtube/Youtube-old";
import Twitch from "../Twitch/Twitch";
import TwitchVods from "../Twitch/Twitch-vods";

import ErrorHandeling from "./../Error/Error";

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoaded: true, error: null };
    this.title = "Feed";
  }

  componentDidMount() {}

  render() {
    console.log("-Rendering-");

    const { error, isLoaded } = this.state;
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
          <Twitch />
          <div className={styles.lineBreak} />
          <Youtube />
          <div className={styles.lineBreak} />
          <TwitchVods />
        </>
      );
    }
  }
}

export default Feed;
