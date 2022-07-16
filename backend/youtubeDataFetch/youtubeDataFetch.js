'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { decrypt } = require('../crypto');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ UserId }) => {
  const res = await client
    .get({
      TableName: process.env.YOUTUBE_DATA_TABLE,
      Key: { UserId },
    })
    .promise();

  return {
    ...res,
    Item: {
      ...res.Item,
      access_token: await decrypt(res.Item.access_token),
      refresh_token: await decrypt(res.Item.refresh_token),
    },
  };
};
