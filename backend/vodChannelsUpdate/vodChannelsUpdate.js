'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ channels, authkey }) => {
  const username = await validateAuthkey(authkey);

  if (username) {
    const res = await client
      .update({
        TableName: process.env.TWITCH_DATA_TABLE,
        Key: { Username: username },
        UpdateExpression: `set #Channels = :channels`,
        ExpressionAttributeNames: { '#Channels': 'vod_channels' },
        ExpressionAttributeValues: {
          ':channels': channels,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    return res;
  }
};
