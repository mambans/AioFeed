import axios from "axios";

import Util from "./../../../util/Util";

/**
 * Fetch and Set uptime state from a Live stream.
 * @param {Object} twitchPlayer twitchPlayer.current (useRef)
 * @param {Function} setUptime Function to set uptime state (useState)
 * @param {Object} uptimeTimer uptime interval timer (useRef)
 * @async
 */
export default async (twitchPlayer, setUptime, uptimeTimer) => {
  const axiosConfig = {
    method: "get",
    url: `https://api.twitch.tv/helix/streams`,
    params: {
      user_id: twitchPlayer.current.getChannelId(),
      first: 1,
    },
    headers: {
      Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
      "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
    },
  };

  await axios(axiosConfig)
    .then((res) => {
      if (res.data.data[0] && res.data.data[0].started_at) {
        setUptime(res.data.data[0].started_at);
      } else {
        uptimeTimer.current = setInterval(async () => {
          await axios(axiosConfig).then((res) => {
            if (res.data.data[0] && res.data.data[0].started_at) {
              setUptime(res.data.data[0].started_at);
              clearInterval(uptimeTimer.current);
            }
          });
        }, 1000 * 30);
      }
    })
    .catch((error) => {
      console.log("Uptime stream: error", error);
    });
};
