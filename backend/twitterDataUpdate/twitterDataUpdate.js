'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ data, UserId }) => {
  const res = await client
    .update({
      TableName: process.env.TWITTER_DATA_TABLE,
      Key: { UserId },
      UpdateExpression: `set #lists = :lists`,
      ExpressionAttributeNames: { '#lists': 'lists' },
      ExpressionAttributeValues: {
        ':lists': data,
      },
      ReturnValues: 'ALL_NEW',
    })
    .promise();

  return res;
};
