'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

exports.handler = async ({ UserId, channel_id }) => {
  const res = await client
    .get({
      TableName: process.env.CHAT_STATES_TABLE,
      Key: {
        UserId,
        channel_id,
      },
    })
    .promise();

  return res;
};
