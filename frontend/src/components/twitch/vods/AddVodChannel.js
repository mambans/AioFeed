import axios from 'axios';
import { getLocalstorage } from '../../../util/Utils';

const addVodChannel = async ({
  channel,
  channels = getLocalstorage('TwitchVods-Channels') || [],
  setChannels,
  username,
  authKey,
}) => {
  try {
    const existingChannels = new Set(channels);
    const newChannels = [...existingChannels.add(channel?.toLowerCase())];

    setChannels([...newChannels]);

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/vodchannels`, {
        username: username,
        authkey: authKey,
        channels: newChannels,
      })
      .catch((error) => console.error(error));

    return newChannels;
  } catch (e) {
    console.log(e.message);
  }
};
export default addVodChannel;
