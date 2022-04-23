'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../../../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ authkey, channel_id }) => {
  const username = await validateAuthkey(authkey);

  const res = await client
    .delete({
      TableName: process.env.TWITCH_VOD_TABLE,
      Key: { username, channel_id },
      ReturnValues: 'ALL_OLD',
    })
    .promise();

  return res;
};
