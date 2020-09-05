import axios from 'axios';
import { getLocalstorage } from '../../../util/Utils';

export default async (username, authKey) => {
  return await axios
    .get(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/vodchannels`, {
      params: {
        username: username,
        authkey: authKey,
      },
    })
    .then((res) => {
      if (res?.data !== '') return res.data;

      return getLocalstorage('TwitchVods-Channels') || [];
    })
    .catch((err) => {
      console.error(err);
      return getLocalstorage('TwitchVods-Channels') || [];
    });
};
