'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ UserId }) => {
  const res = await client
    .get({
      TableName: process.env.TWITTER_DATA_TABLE,
      Key: { UserId },
    })
    .promise();

  return res;
};
