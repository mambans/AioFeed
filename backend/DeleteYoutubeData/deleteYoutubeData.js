const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ authkey }) => {
  const username = await validateAuthkey(authkey);

  const AccountInfo = await client
    .get({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
    })
    .promise();

  if (!username) throw new Error('Invalid AuthKey');

  return await client
    .update({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: AccountInfo.Item.Username },
      UpdateExpression: `REMOVE #Preferences`,
      ExpressionAttributeNames: {
        '#Preferences': 'YoutubePreferences',
      },
    })
    .promise();
};
