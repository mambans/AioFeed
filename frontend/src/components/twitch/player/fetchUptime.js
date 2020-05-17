import validateToken from "../validateToken";
import API from "../API";

/**
 * Fetch and Set uptime state from a Live stream.
 * @param {Object} twitchPlayer twitchPlayer.current (useRef)
 * @param {Function} setUptime Function to set uptime state (useState)
 * @param {Object} uptimeTimer uptime interval timer (useRef)
 * @async
 */
export default async (twitchPlayer, setUptime, uptimeTimer) => {
  await validateToken().then(async () => {
    await API.getStreams({
      params: {
        user_id: twitchPlayer.current.getChannelId(),
        first: 1,
      },
    })
      .then((res) => {
        if (res.data.data[0] && res.data.data[0].started_at) {
          setUptime(res.data.data[0].started_at);
        } else {
          uptimeTimer.current = setInterval(async () => {
            await API.getStreams({
              params: {
                user_id: twitchPlayer.current.getChannelId(),
                first: 1,
              },
            }).then((res) => {
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
  });
};
