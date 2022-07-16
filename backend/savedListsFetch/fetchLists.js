'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ UserId }) => {
  const res = await client
    .query({
      TableName: process.env.SAVED_LISTS,
      KeyConditionExpression: '#UserId = :UserId',
      ExpressionAttributeNames: {
        '#UserId': 'UserId',
      },
      ExpressionAttributeValues: {
        ':UserId': UserId,
      },
      // ReturnConsumedCapacity: 'TOTAL',
    })
    .promise();

  return res;
};
