'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ authkey, channel_id }) => {
  console.log('channel_id:', channel_id);
  const username = await validateAuthkey(authkey);

  if (username) {
    const res = await client
      .get({
        TableName: process.env.CHAT_STATES_TABLE,
        Key: {
          username: username,
          channel_id: channel_id,
        },
      })
      .promise();

    return res;
  }
};
