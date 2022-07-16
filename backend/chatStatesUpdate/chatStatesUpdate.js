'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({
  data: { chatwidth, switchChatSide, hideChat, chatAsOverlay, overlayPosition },
  UserId,
  channel_id,
}) => {
  const res = await client
    .put({
      TableName: process.env.CHAT_STATES_TABLE,
      Item: {
        UserId,
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
};
