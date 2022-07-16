'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({
  id,
  data: {
    title,
    rules,
    enabled,
    sidebarsidebar_enabled,
    notifications_enabled,
    excludeFromTwitch_enabled,
  },
  UserId,
}) => {
  const res = await client
    .put({
      TableName: process.env.CUSTOM_FEED_SECTIONS,
      Item: {
        UserId,
        id,
        title,
        rules,
        enabled,
        sidebarsidebar_enabled,
        notifications_enabled,
        excludeFromTwitch_enabled,
      },
      ReturnItemCollectionMetrics: 'SIZE',
      ReturnValues: 'ALL_OLD',
    })
    .promise();

  return res;
};
