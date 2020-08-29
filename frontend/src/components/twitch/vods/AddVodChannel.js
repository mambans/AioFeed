import axios from 'axios';
import { getLocalstorage } from '../../../util/Utils';

export default async ({ channel, username, authKey }) => {
  try {
    const existingChannels = new Set(getLocalstorage('VodChannels') || []);

    const newChannels = [...existingChannels.add(channel?.toLowerCase())];

    localStorage.setItem('VodChannels', JSON.stringify(newChannels));

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
