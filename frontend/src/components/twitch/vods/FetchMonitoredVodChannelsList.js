import axios from 'axios';

const fetchMonitoredVodChannelsList = async (username, authKey) => {
  return await axios
    .get(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/preferences`, {
      params: {
        username: username,
        authkey: authKey,
      },
    })
    .then((res) => res?.data)
    .catch((err) => console.error(err));
};
export default fetchMonitoredVodChannelsList;
