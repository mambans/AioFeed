'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({
  data: { chatwidth, switchChatSide, hideChat, chatAsOverlay, overlayPosition },
  authkey,
  channel_id,
}) => {
  const username = await validateAuthkey(authkey);
  console.log('channel_id:', channel_id);

  if (username) {
    const res = await client
      .put({
        TableName: process.env.CHAT_STATES_TABLE,
        Item: {
          username,
          channel_id,
          chatwidth,
          switchChatSide,
          hideChat,
          chatAsOverlay,
          overlayPosition,
        },
        ReturnItemCollectionMetrics: 'SIZE',
        ReturnValues: 'ALL_OLD',
      })
      .promise();

    return res;
  }
};
