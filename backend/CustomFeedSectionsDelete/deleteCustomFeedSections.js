'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ id, UserId }) => {
  const res = await client
    .delete({
      TableName: process.env.CUSTOM_FEED_SECTIONS,
      Key: { Id, UserId },
      ReturnValues: 'ALL_OLD',
    })
    .promise();

  return res;
};
