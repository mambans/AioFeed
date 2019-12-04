import React from "react";

import styles from "./Home.module.scss";

function Home() {
  function Logos() {
    return (
      <div className={styles.container}>
        <img
          src={`${process.env.PUBLIC_URL}/icons/v3/Logo-wide.png`}
          alt='logo'
          className={styles.logo}
        />
        <div className={styles.deviderLine}></div>
        <h1>
          <b>Notifies</b>
        </h1>
        <p>A site/app for viewing feeds and updates from Youtube and Twitch.</p>
      </div>
    );
  }
  return <Logos></Logos>;
}

export default Home;
