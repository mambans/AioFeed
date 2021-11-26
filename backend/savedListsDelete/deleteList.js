'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ authkey, id }) => {
  const username = await validateAuthkey(authkey);

  const res = await client
    .delete({
      TableName: process.env.SAVED_LISTS,
      Key: { username, id },
      ReturnValues: 'ALL_OLD',
    })
    .promise();

  return res;
};
