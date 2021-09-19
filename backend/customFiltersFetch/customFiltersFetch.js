'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const validateAuthKey = require('./../validateAuthKey/validateAuthKey');

module.exports = async ({ username, authkey }) => {
  const authTokenValid = await validateAuthKey({ username, authkey });

  if (authTokenValid) {
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
