'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ username, channels, authkey }) => {
  const res = await client
    .update({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
      UpdateExpression: `set #Preferences.Channels = :channels`,
      ExpressionAttributeNames: { '#Preferences': 'TwitchVodsPreferences' },
      ExpressionAttributeValues: {
        ':channels': channels,
      },
      ReturnValues: 'ALL_NEW',
    })
    .promise();

  if (authkey === res.Attributes.AuthKey) {
    return res;
  }
};
