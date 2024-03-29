import TwitchAPI from '../API';

/**
 * Fetch and Set uptime state from a Live stream.
 * @param {Object} {key: value} Key and value pair with either key as user_id or user_login
 * @param {Function} setUptime Function to set uptime state (useState)
 * @param {Object} uptimeTimer uptime interval timer (useRef)
 * @async
 */
const fetchStreamInfo = async (keyValuePair) => {
  return await TwitchAPI.getStreams({
    ...keyValuePair,
    first: 1,
  })
    .then((res) => res.data?.data[0])
    .catch((error) => console.log(error));
};
export default fetchStreamInfo;
