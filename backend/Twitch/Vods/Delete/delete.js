'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ UserId, channel_id }) => {
  const res = await client
    .delete({
      TableName: process.env.TWITCH_VOD_TABLE,
      Key: { UserId, channel_id },
      ReturnValues: 'ALL_OLD',
    })
    .promise();

  return res;
};
