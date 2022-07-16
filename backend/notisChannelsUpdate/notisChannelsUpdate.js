'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ channels, UserId }) => {
  const res = await client
    .update({
      TableName: process.env.TWITCH_DATA_TABLE,
      Key: { UserId },
      UpdateExpression: `set #channelUpdateNotis = :channels`,
      ExpressionAttributeNames: { '#channelUpdateNotis': 'channel_update_notis' },
      ExpressionAttributeValues: {
        ':channels': channels,
      },
      ReturnValues: 'ALL_NEW',
    })
    .promise();

  return res;
};
