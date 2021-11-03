'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ authkey }) => {
  const username = await validateAuthkey(authkey);

  if (username) {
    const res = await client
      .get({
        TableName: process.env.CUSTOM_FILTERS_TABLE,
        Key: { Username: username },
      })
      .promise();
    return res;
  }
  return false;
};
