const axios = require('axios');

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const { validateAuthkey } = require('../authkey');
const { encrypt, decrypt } = require('../crypto');

module.exports = async ({ code, authkey }) => {
  const username = await validateAuthkey(authkey);

  if (username) {
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
          const encrypted_AccessToken = await encrypt(res.data.access_token);
          const encrypted_RefreshToken = await encrypt(res.data.refresh_token);

          await client
            .update({
              TableName: process.env.YOUTUBE_DATA_TABLE,
              Key: { Username: username },
              UpdateExpression: `set #access_token = :access_token, #refresh_token = :refresh_token`,
              ExpressionAttributeNames: {
                '#access_token': 'access_token',
                '#refresh_token': 'refresh_token',
              },
              ExpressionAttributeValues: {
                ':access_token': encrypted_AccessToken,
                ':refresh_token': encrypted_RefreshToken,
              },
            })
            .promise();

          return res.data;
        });
    } else {
      const YoutubeData = await client
        .get({
          TableName: process.env.YOUTUBE_DATA_TABLE,
          Key: { Username: username },
        })
        .promise();

      if (code === 'undefined' && !YoutubeData.Item.refresh_token) {
        throw new Error(
          'Invalid request, no refresh token found in database. Require an code={authorizationCode} as param for the first authtication.'
        );
      }

      const decryptedRefreshToken = await decrypt(YoutubeData.Item.refresh_token);

      return await axios
        .post('https://oauth2.googleapis.com/token', {
          client_id: process.env.YOUTUBE_CLIENT_ID,
          client_secret: process.env.YOUTUBE_CLIENT_SECRET,
          refresh_token: decryptedRefreshToken,
          grant_type: 'refresh_token',
        })
        .then(async (res) => {
          const encrypted_AccessToken = await encrypt(res.data.access_token);

          await client
            .update({
              TableName: process.env.YOUTUBE_DATA_TABLE,
              Key: { Username: username },
              UpdateExpression: `set #access_token = :access_token`,
              ExpressionAttributeNames: {
                '#access_token': 'access_token',
              },
              ExpressionAttributeValues: {
                ':access_token': encrypted_AccessToken,
              },
            })
            .promise();

          return res.data;
        });
    }
  }
};
