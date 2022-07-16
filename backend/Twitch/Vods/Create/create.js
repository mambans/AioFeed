'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ channel_id, UserId }) => {
  const res = await client
    .put({
      TableName: process.env.TWITCH_VOD_TABLE,
      Item: {
        UserId,
        channel_id,
      },
      ReturnItemCollectionMetrics: 'SIZE',
      ReturnValues: 'ALL_OLD',
    })
    .promise();

  return res;
};
