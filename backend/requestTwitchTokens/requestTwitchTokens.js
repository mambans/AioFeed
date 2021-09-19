const axios = require('axios');

module.exports = async ({ authCode }) => {
  return await axios
    .post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&code=${authCode}&grant_type=authorization_code&redirect_uri=https://aiofeed.com/auth/twitch/callback`
    )
    .then(async (res) => res.data);
};
