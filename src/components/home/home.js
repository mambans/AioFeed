import React from "react";
import { Alert } from "react-bootstrap";

// Own modules
import logo from "../../assets/images/logo-white-v2.png";
import logoWhite from "../../assets/images/logo-v2.png";
import styles from "./Home.module.scss";
import Utilities from "utilities/Utilities";

function Home() {
  function Logos() {
    return (
      <div className={styles.container}>
        <img src={logo} alt="logo" className={styles.logo} />
        <img src={logoWhite} alt="logo" className={styles.logo} />
        <p>A site/app for viewing feeds and updates from Youtube and Twitch.</p>
      </div>
    );
  }

  const url = new URL(window.location.href);

  if (url.searchParams.get("TwitchloggedIn") && sessionStorage.getItem("TwitchLoggedIn")) {
    return (
      <>
        <Alert variant="success" style={Utilities.alertWarning}>
          <Alert.Heading>Successfully logged in with Twitch!</Alert.Heading>
          <hr />
        </Alert>
        <Logos></Logos>
      </>
    );
  } else if (url.searchParams.get("YoutubeloggedIn") && sessionStorage.getItem("YoutubeLoggedIn")) {
    return (
      <>
        <Alert variant="success" style={Utilities.alertWarning}>
          <Alert.Heading>Successfully logged in with Youtube!</Alert.Heading>
          <hr />
        </Alert>
        <Logos></Logos>
      </>
    );
  } else {
    return <Logos></Logos>;
  }
}

export default Home;
