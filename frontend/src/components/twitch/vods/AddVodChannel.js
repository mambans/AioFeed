import axios from 'axios';
import { getLocalstorage } from '../../../util/Utils';

export default async ({
  channel,
  channels = getLocalstorage('TwitchVods-Channels') || [],
  setChannels,
  username,
  authKey,
}) => {
  try {
    // const existingChannels = new Set(getLocalstorage('TwitchVods-Channels') || []);
    const existingChannels = new Set(channels);

    const newChannels = [...existingChannels.add(channel?.toLowerCase())];

    // localStorage.setItem('TwitchVods-Channels', JSON.stringify(newChannels));
    setChannels(newChannels);

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/vodchannels`, {
        username: username,
        authkey: authKey,
        channels: newChannels,
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (e) {
    console.log(e.message);
  }
};
