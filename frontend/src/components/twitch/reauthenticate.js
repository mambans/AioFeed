import API from '../navigation/API';

const reauthenticate = async (setTwitchToken, setRefreshToken) => {
  console.log('---Re-authenticating with Twitch.---');

  return await API.updateTwitchToken(setTwitchToken, setRefreshToken);
};
export default reauthenticate;
