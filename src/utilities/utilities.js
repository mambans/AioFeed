import placeholderImg from "./../assets/images/placeholder.png";

const Utilities = {
    loadingSpinner: {
        position: "absolute",
        left: "calc(50% - 5rem)",
        top: "20%",
        height: "10rem",
        width: "10rem",
    },
    alertWarning: {
        "text-align": "center",
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
};

export default Utilities;
