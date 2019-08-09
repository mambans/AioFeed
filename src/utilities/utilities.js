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
};

export default Utilities;
