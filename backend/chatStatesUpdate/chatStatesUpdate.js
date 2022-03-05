'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({
  id,
  data: { channel_id, chatwidth, switchChatSide, hideChat, chatAsOverlay, overlayPosition },
  authkey,
}) => {
  const username = await validateAuthkey(authkey);

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
