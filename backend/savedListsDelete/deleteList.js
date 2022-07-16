'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ UserId, id }) => {
  const res = await client
    .delete({
      TableName: process.env.SAVED_LISTS,
      Key: { UserId, id },
      ReturnValues: 'ALL_OLD',
    })
    .promise();

  return res;
};
