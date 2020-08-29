import validateToken from '../validateToken';
import API from '../API';

/**
 * Fetch and Set uptime state from a Live stream.
 * @param {Object} {key: value} Key and value pair with either key as user_id or user_login
 * @param {Function} setUptime Function to set uptime state (useState)
 * @param {Object} uptimeTimer uptime interval timer (useRef)
 * @async
 */
export default async (keyValuePair) => {
  return await validateToken().then(async () => {
    return await API.getStreams({
      params: {
        ...keyValuePair,
        first: 1,
      },
    })
      .then((res) => res.data?.data[0])
      .catch((error) => console.log(error));
  });
};
