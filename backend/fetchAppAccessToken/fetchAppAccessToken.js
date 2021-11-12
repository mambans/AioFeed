const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const axios = require('axios');

module.exports = async () => {
  const savedToken = await client
    .get({
      TableName: process.env.APPINFO_TABLE,
      Key: { Name: 'AppToken' },
    })
    .promise();

  if (savedToken && savedToken.Item && savedToken.Item.token) {
    return { access_token: savedToken.Item.token, expires_in: savedToken.Item.TTL };
  }

  const newAppToken = await axios
    .post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
    )
    .then((res) => res.data)
    .catch((e) => console.log(e));

  if (newAppToken && newAppToken.access_token) {
    await client
      .update({
        TableName: process.env.APPINFO_TABLE,
        Key: { Name: 'AppToken' },
        UpdateExpression: `set #token = :token, #TTL = :TTL`,
        ExpressionAttributeNames: {
          '#token': 'token',
          '#TTL': 'TTL',
        },
        ExpressionAttributeValues: {
          ':token': newAppToken.access_token,
          ':TTL': Math.trunc((Date.now() + newAppToken.expires_in * 1000) / 1000),
        },
      })
      .promise();

    return newAppToken;
  }
};
