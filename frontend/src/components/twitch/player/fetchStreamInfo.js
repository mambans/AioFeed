import validateToken from "../validateToken";
import API from "../API";

/**
 * Fetch and Set uptime state from a Live stream.
 * @param {Object} twitchPlayer twitchPlayer.current (useRef)
 * @param {Function} setUptime Function to set uptime state (useState)
 * @param {Object} uptimeTimer uptime interval timer (useRef)
 * @async
 */
export default async (twitchPlayer) => {
  return await validateToken().then(async () => {
    return await API.getStreams({
      params: {
        user_id: twitchPlayer.current.getChannelId(),
        first: 1,
      },
    })
      .then((res) => {
        return res.data.data[0];
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
