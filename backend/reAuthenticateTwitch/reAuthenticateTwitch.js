const axios = require("axios");

const reAuthenticateTwitch = async ({ refresh_token }) => {
  return await axios
    .post(
      `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURI(
        refresh_token
      )}&client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${
        process.env.TWITCH_CLIENT_SECRET
      }&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code`
    )
    .then(async (res) => {
      return res.data;
    });
};

module.exports = reAuthenticateTwitch;
