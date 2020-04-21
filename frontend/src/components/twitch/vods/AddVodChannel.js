import axios from "axios";
import Util from "../../../util/Util";

export default async ({ channel, username, authKey }) => {
  try {
    const existingChannels = [channel.toLowerCase(), ...Util.getLocalstorage("VodChannels")];
    // const existingChannels = [channel.toLowerCase(), ...channels];
    const newChannels = [
      ...new Set(
        existingChannels.map((user) => {
          return user;
        })
      ),
    ];

    // setChannels(newChannels);
    localStorage.setItem("VodChannels", JSON.stringify(newChannels));

    await axios
      .put(
        `https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/update`,
        {
          username: username,
          authkey: authKey,
          channels: newChannels,
        }
      )
      .catch((error) => {
        console.error(error);
      });
  } catch (e) {
    console.log(e.message);
  }
};
