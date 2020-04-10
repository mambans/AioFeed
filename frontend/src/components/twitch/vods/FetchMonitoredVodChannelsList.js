import axios from "axios";

export default async (username, authKey) => {
  return await axios
    .get(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/fetch`, {
      params: {
        username: username,
        authkey: authKey,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });
};
