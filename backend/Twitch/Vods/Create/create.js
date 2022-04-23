'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../../../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ channel_id, authkey }) => {
  const username = await validateAuthkey(authkey);

  if (username) {
    const res = await client
      .put({
        TableName: process.env.TWITCH_VOD_TABLE,
        Item: {
          username,
          channel_id,
        },
        ReturnItemCollectionMetrics: 'SIZE',
        ReturnValues: 'ALL_OLD',
      })
      .promise();

    return res;
  }
};
