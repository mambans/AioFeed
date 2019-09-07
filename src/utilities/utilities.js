import React from "react";

import placeholderImg from "./../assets/images/placeholder.png";
import styles from "components/twitch/Twitch.module.scss";

const Utilities = {
  loadingSpinner: {
    position: "absolute",
    left: "calc(50% - 5rem)",
    top: "20%",
    height: "10rem",
    width: "10rem",
  },
  loadingSpinnerSmall: {
    position: "relative",
    height: "26px",
    width: "26px",
    left: "7.5%",
    bottom: "-25px",
  },
  alertWarning: {
    textAlign: "center",
  },
  truncate: function(input, max) {
    if (input.length > max) return input.substring(0, max) + "..";
    else return input;
  },

  videoImageUrls(urls) {
    if (urls.maxres) {
      return urls.maxres.url;
    } else if (urls.standard) {
      return urls.standard.url;
    } else if (urls.high) {
      return urls.high.url;
    } else if (urls.medium) {
      return urls.medium.url;
    } else {
      return placeholderImg;
    }
  },

  // Format PT25M1S to 25:10
  async formatDuration(duration) {
    let hours;
    let minutes;
    let seconds;
    let formatDuration;
    let time;
    let timeformat;

    try {
      if (duration.includes("H")) {
        time = duration
          .replace("PT", "")
          .replace("H", ":")
          .replace("M", ":")
          .replace("S", "");
        timeformat = "hours";
      } else if (duration.includes("M")) {
        time = duration
          .replace("PT", "")
          .replace("M", ":")
          .replace("S", "");
        timeformat = "minutes";
      } else {
        time = duration.replace("PT", "").replace("S", "");
        timeformat = "seconds";
      }
    } catch (error) {
      console.trace(error);
    }

    let timeSegments = time.split(":");

    if (timeformat === "hours") {
      hours = timeSegments[0];
      minutes = timeSegments[1];
      seconds = timeSegments[2];

      if (hours.length <= 1) {
        hours = "0" + hours;
      }

      if (minutes.length <= 1) {
        minutes = "0" + minutes;
      }

      if (seconds.length <= 1) {
        seconds = "0" + seconds;
      }

      formatDuration = hours + ":" + minutes + ":" + seconds;
    } else if (timeformat === "minutes") {
      minutes = timeSegments[0];
      seconds = timeSegments[1];

      if (minutes.length <= 1) {
        minutes = "0" + minutes;
      }

      if (seconds.length <= 1) {
        seconds = "0" + seconds;
      }

      formatDuration = minutes + ":" + seconds;
    } else if (timeformat === "seconds") {
      seconds = timeSegments[0];

      if (seconds.length <= 1) {
        seconds = "0" + seconds;
      }

      formatDuration = seconds;
    }

    return formatDuration;
  },

  OnlyReruns(type) {
    if (!type === "live") {
      return <p className={styles.type}>{type}</p>;
    }
  },

  msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  },
};

export default Utilities;
