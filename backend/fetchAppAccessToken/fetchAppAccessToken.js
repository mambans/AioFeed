const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const axios = require('axios');

module.exports = async () => {
  const appToken = await client
    .get({
      TableName: process.env.APPINFO_TABLE,
      Key: { Name: 'AppToken' },
    })
    .promise();

  if (!appToken || !appToken.length || appToken.expire < Date.now()) {
    const newAppToken = await axios
      .post(
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
      )
      .then((res) => res.data)
      .catch((e) => console.log(e));

    console.log('newAppToken: ', newAppToken);

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
            ':TTL': Date.now() + newAppToken.expires_in,
          },
        })
        .promise();
    }

    return newAppToken;
  }

  return appToken;
};
