import React from "react";

// Own modules
import logo from "../../assets/images/logo-white-v2.png";
import logoWhite from "../../assets/images/logo-v2.png";
import styles from "./Home.module.scss";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.title = "Home";
  }

  Logos() {
    return (
      <div className={styles.container}>
        <img src={logo} alt="logo" className={styles.logo} />
        <img src={logoWhite} alt="logo" className={styles.logo} />
        <p>A site/app for viewing feeds and updates from Youtube and Twitch.</p>
      </div>
    );
  }

  render() {
    return (
      <>
        {" "}
        <this.Logos />
      </>
    );
  }
}

export default Home;
