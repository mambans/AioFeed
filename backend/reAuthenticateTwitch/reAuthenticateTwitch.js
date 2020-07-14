const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const axios = require('axios');
const AES = require('crypto-js/aes');

module.exports = async ({ refresh_token, username, authkey }) => {
  const res = await axios
    .post(
      `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURI(
        refresh_token
      )}&client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${
        process.env.TWITCH_CLIENT_SECRET
      }&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code`
    )
    .then(async (res) => {
      return res.data;
    })
    .catch((e) => {
      console.log('reAuthenticateTwitch -> e', e);
    });

  if (username && authkey) {
    const AccountInfo = await client
      .get({
        TableName: process.env.USERNAME_TABLE,
        Key: { Username: username },
      })
      .promise();

    if (authkey !== AccountInfo.Item.AuthKey) throw new Error('Invalid AuthKey');

    const encrypted_AccessToken = await AES.encrypt(
      res.access_token,
      'TwitchPreferences'
    ).toString();
    const encrypted_RefreshToken = await AES.encrypt(
      res.refresh_token,
      'TwitchPreferences'
    ).toString();

    await client
      .update({
        TableName: process.env.USERNAME_TABLE,
        Key: { Username: AccountInfo.Item.Username },
        UpdateExpression: `set #Preferences.#AccessToken = :Access_token, #Preferences.#RefreshToken = :Refresh_token`,
        ExpressionAttributeNames: {
          '#Preferences': 'TwitchPreferences',
          '#AccessToken': 'Token',
          '#RefreshToken': 'Refresh_token',
        },
        ExpressionAttributeValues: {
          ':Access_token': encrypted_AccessToken,
          ':Refresh_token': encrypted_RefreshToken,
        },
      })
      .promise();
  }

  return res;
};
