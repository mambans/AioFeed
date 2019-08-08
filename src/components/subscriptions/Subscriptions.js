const axios = require("axios");

// async function getSubsriptionChannels() {
//     try {
//         const response = await axios.get(
//             "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&key=AIzaSyCQy9tlwoRF0WrLf3oCFsvVwgVygpcpADE"
//             // {
//             //     headers: {
//             //         "Content-Type": "application/json",
//             //         Authorization: "AIzaSyCQy9tlwoRF0WrLf3oCFsvVwgVygpcpADE",
//             //     },
//             // }
//         );
//         console.log(response);
//     } catch (error) {
//         console.error(error);
//     }
// }

async function getSubscriptionVideos() {
    console.log(1);

    try {
        const response = await axios.get(
            "https://www.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=UCHiof82PvgZrXFF-BRMvGDg&maxResults=10&key=AIzaSyCQy9tlwoRF0WrLf3oCFsvVwgVygpcpADE"
        );
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
    }
    console.log(2);
}

export default getSubscriptionVideos;
