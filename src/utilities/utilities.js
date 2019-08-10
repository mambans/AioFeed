import placeholderImg from "./../assets/images/placeholder.png";

const Utilities = {
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
        let minutes = duration.split("PT")[1].split("M")[0];
        // let minutes = durations.split("M")[0];
        let seconds = minutes[1].split("S")[0];

        if (seconds.length < 2) {
            return minutes + ":" + seconds + 0;
        } else {
            return minutes + ":" + seconds;
        }
    },
};

export default Utilities;
