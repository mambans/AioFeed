import React from "react";

import placeholderImg from "./../assets/images/placeholder.png";
import styles from "components/twitch/Twitch.module.scss";

const Utilities = {
  loadingSpinner: {
    // position: "absolute",
    // left: "calc(50% - 5rem)",
    // top: "20%",
    marginLeft: "calc(50% - 5rem)",
    height: "10rem",
    width: "10rem",
    marginTop: "20px",
  },
  loadingSpinnerSmall: {
    position: "relative",
    height: "26px",
    width: "26px",
    left: "1.5%",
    bottom: "-25px",
  },
  alertWarning: {
    textAlign: "center",
  },
  feedAlertWarning: {
    textAlign: "center",
    width: "86%",
    margin: "auto",
    marginTop: "50px",
  },
  truncate: function(input, max) {
    if (input.length > max) return input.substring(0, max) + "..";
    else return input;
  },

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        // console.log(`Cookie ${cname}: ${c.substring(name.length, c.length)}`);

        return c.substring(name.length, c.length);
      }
    }
    return null;
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
      hours = timeSegments[0] || "00";
      minutes = timeSegments[1] || "00";
      seconds = timeSegments[2] || "00";

      if (hours.length <= 1) {
        hours = "0" + hours;
      }

      if (minutes.length <= 1) {
        minutes = "0" + minutes;
      }

      if (seconds.length <= 1) {
        if (seconds.length <= 0) {
          seconds = "00";
        } else {
          seconds = "0" + seconds;
        }
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

  formatTwitchVodsDuration(duration) {
    let hour;

    const duration1 = duration
      .replace("h", ":")
      .replace("m", ":")
      .replace("s", "");

    const durationParts = duration1.split(":");
    if (duration.includes("h")) hour = durationParts.shift();

    let i = 0;
    durationParts.map(number => {
      if (number.length < 2) durationParts[i] = 0 + number;

      i++;

      return "";
    });

    if (hour) {
      return hour + ":" + durationParts.join(":");
    } else {
      return durationParts.join(":");
    }
  },
};

export default Utilities;
