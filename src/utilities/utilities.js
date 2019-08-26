import React from "react";

import placeholderImg from "./../assets/images/placeholder.png";
import styles from "components/Twitch/Twitch.module.scss";

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
        left: "11%",
        bottom: "-27px",
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
    formatDuration(duration) {
        let hours;
        let minutes;
        let seconds;

        if (duration.includes("H")) {
            let asd = duration.split("PT")[1].split("H");

            hours = asd[0];
            minutes = asd[1].split("M")[0];
            seconds = asd[1].split("M")[1].split("S")[0];
        } else {
            minutes = duration.split("PT")[1].split("M")[0];
            seconds = duration
                .split("PT")[1]
                .split("M")[1]
                .split("S")[0];
        }

        // if (seconds.length < 2) {
        //     seconds += 0;
        // }

        seconds = seconds.length < 2 ? seconds + 0 : seconds;

        if (hours) {
            return hours + ":" + minutes + ":" + seconds;
        } else {
            return minutes + ":" + seconds;
        }
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
