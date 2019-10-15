import React from "react";

import styles from "./Home.module.scss";

function Home() {
  function Logos() {
    return (
      <div className={styles.container}>
        <img
          src={`${process.env.PUBLIC_URL}/icons/v3/Logo-4k.png`}
          alt='logo'
          className={styles.logo}
        />
        <div
          style={{
            height: "5px",
            width: "100%",
            margin: "10px auto 10px",
            background: "#cecece78",
            borderRadius: "5px",
          }}></div>
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
