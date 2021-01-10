const axios = require('axios');

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const AES = require('crypto-js/aes');
const enc = require('crypto-js/enc-utf8');

module.exports = async ({ code, authkey, username }) => {
  const AccountInfo = await client
    .get({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
    })
    .promise();

  if (authkey !== AccountInfo.Item.AuthKey) throw new Error('Invalid AuthKey');
  if (code === 'undefined' && !AccountInfo.Item.YoutubePreferences.Refresh_token) {
    throw new Error(
      'Invalid request, no refresh token found in database. Require an code={authorizationCode} as param for the first authtication.'
    );
  }

  if (authkey === AccountInfo.Item.AuthKey) {
    if (code !== 'undefined') {
      return await axios
        .post('https://oauth2.googleapis.com/token', {
          client_id: process.env.YOUTUBE_CLIENT_ID,
          client_secret: process.env.YOUTUBE_CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: 'https://aiofeed.com/auth/youtube/callback',
        })
        .then(async (res) => {
          const encrypted_AccessToken = await AES.encrypt(
            res.data.access_token,
            'YoutubePreferences'
          ).toString();
          const encrypted_RefreshToken = await AES.encrypt(
            res.data.refresh_token,
            'YoutubePreferences'
          ).toString();

          const updateData = AccountInfo.Item.YoutubePreferences
            ? {
                UpdateExpression: `set #Preferences.#AccessToken = :Access_token, #Preferences.#RefreshToken = :Refresh_token`,
                ExpressionAttributeNames: {
                  '#Preferences': 'YoutubePreferences',
                  '#AccessToken': 'Token',
                  '#RefreshToken': 'Refresh_token',
                },
                ExpressionAttributeValues: {
                  ':Access_token': encrypted_AccessToken,
                  ':Refresh_token': encrypted_RefreshToken,
                },
              }
            : {
                UpdateExpression: `set #Preferences = :PrefObj`,
                ExpressionAttributeNames: {
                  '#Preferences': 'YoutubePreferences',
                },
                ExpressionAttributeValues: {
                  ':PrefObj': {
                    Token: encrypted_AccessToken,
                    Refresh_token: encrypted_RefreshToken,
                  },
                },
              };

          await client
            .update({
              TableName: process.env.USERNAME_TABLE,
              Key: { Username: AccountInfo.Item.Username },
              ...updateData,
            })
            .promise();

          return res.data;
        })
        .catch((error) => console.log('error: ', error));
    } else {
      const decryptedRefreshToken = await AES.decrypt(
        AccountInfo.Item.YoutubePreferences.Refresh_token,
        'YoutubePreferences'
      ).toString(enc);

      return await axios
        .post('https://oauth2.googleapis.com/token', {
          client_id: process.env.YOUTUBE_CLIENT_ID,
          client_secret: process.env.YOUTUBE_CLIENT_SECRET,
          refresh_token: decryptedRefreshToken,
          grant_type: 'refresh_token',
        })
        .then(async (res) => {
          const encrypted_AccessToken = await AES.encrypt(
            res.data.access_token,
            'YoutubePreferences'
          ).toString();

          const updateData = AccountInfo.Item.YoutubePreferences
            ? {
                UpdateExpression: `set #Preferences.#AccessToken = :Access_token`,
                ExpressionAttributeNames: {
                  '#Preferences': 'YoutubePreferences',
                  '#AccessToken': 'Token',
                },
                ExpressionAttributeValues: {
                  ':Access_token': encrypted_AccessToken,
                },
              }
            : {
                UpdateExpression: `set #Preferences = :PrefObj`,
                ExpressionAttributeNames: {
                  '#Preferences': 'YoutubePreferences',
                },
                ExpressionAttributeValues: {
                  ':PrefObj': { Token: encrypted_AccessToken },
                },
              };

          await client
            .update({
              TableName: process.env.USERNAME_TABLE,
              Key: { Username: AccountInfo.Item.Username },
              ...updateData,
            })
            .promise();

          return res.data;
        })
        .catch((error) => console.log('Error: ', error));
    }
  }
};
