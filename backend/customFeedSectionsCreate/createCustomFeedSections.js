'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ id, data: { title, rules, enabled }, authkey }) => {
  const username = await validateAuthkey(authkey);

  if (username) {
    const res = await client
      .put({
        TableName: process.env.CUSTOM_FEED_SECTIONS,
        Item: {
          username,
          id,
          title,
          rules,
          enabled,
        },
        ReturnItemCollectionMetrics: 'SIZE',
        ReturnValues: 'ALL_OLD',
      })
      .promise();

    return res;
  }
};
