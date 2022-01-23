'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ authkey }) => {
  const username = await validateAuthkey(authkey);
  if (username) {
    const res = await client
      .query({
        TableName: process.env.SAVED_LISTS,
        KeyConditionExpression: '#username = :username',
        ExpressionAttributeNames: {
          '#username': 'username',
        },
        ExpressionAttributeValues: {
          ':username': username,
        },
        // ReturnConsumedCapacity: 'TOTAL',
      })
      .promise();

    return res;
  }
};
