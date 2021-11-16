const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ authkey }) => {
  const username = await validateAuthkey(authkey);
  if (!username) throw new Error('Invalid AuthKey');

  return await client
    .update({
      TableName: process.env.YOUTUBE_DATA_TABLE,
      Key: { Username: username },
      UpdateExpression: `REMOVE #access_token, #refresh_token, #user`,
      ExpressionAttributeNames: {
        '#access_token': 'access_token',
        '#refresh_token': 'refresh_token',
        '#user': 'user',
      },
    })
    .promise();
};
