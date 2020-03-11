import axios from "axios";

/**
 * Fetch and Set uptime state from a Live stream.
 * @param {Object} twitchPlayer twitchPlayer.current (useRef)
 * @param {String} twitchToken Twitch access token
 * @param {Function} setUptime Function to set uptime state (useState)
 * @param {Object} uptimeTimer uptime interval timer (useRef)
 * @async
 */
export default async (twitchPlayer, twitchToken, setUptime, uptimeTimer) => {
  await axios
    .get(`https://api.twitch.tv/helix/streams`, {
      params: {
        user_id: twitchPlayer.current.getChannelId(),
        first: 1,
      },
      headers: {
        Authorization: `Bearer ${twitchToken}`,
        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
      },
    })
    .then(res => {
      if (res.data.data[0] && res.data.data[0].started_at) {
        setUptime(res.data.data[0].started_at);
      } else {
        uptimeTimer.current = setInterval(async () => {
          await axios
            .get(`https://api.twitch.tv/helix/streams`, {
              params: {
                user_id: twitchPlayer.current.getChannelId(),
                first: 1,
              },
              headers: {
                Authorization: `Bearer ${twitchToken}`,
                "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
              },
            })
            .then(res => {
              if (res.data.data[0] && res.data.data[0].started_at) {
                setUptime(res.data.data[0].started_at);
                clearInterval(uptimeTimer.current);
              }
            });
        }, 1000 * 30);
      }
    })
    .catch(error => {
      console.log("Uptime stream: error", error);
    });
};
