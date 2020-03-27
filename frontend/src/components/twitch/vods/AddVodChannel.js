import axios from "axios";

export default async ({ channel, channels, setChannels, username, authKey }) => {
  try {
    const existingChannels = [channel.toLowerCase(), ...channels];
    const newChannels = [
      ...new Set(
        existingChannels.map(user => {
          return user;
        })
      ),
    ];

    setChannels(newChannels);
    localStorage.setItem("VodChannels", JSON.stringify(newChannels));

    await axios
      .put(
        `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/update`,
        {
          username: username,
          authkey: authKey,
          channels: newChannels,
        }
      )
      .catch(error => {
        console.error(error);
      });
  } catch (e) {
    console.log(e.message);
  }
};
