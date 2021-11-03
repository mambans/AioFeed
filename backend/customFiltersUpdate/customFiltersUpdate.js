'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

// const validateAuthKey = require('./../validateAuthKey/validateAuthKey');

module.exports = async ({ filtesObj, authkey }) => {
  const username = await validateAuthkey(authkey);

  const authTokenValid = await validateAuthKey({ username, authkey });

  if (authTokenValid) {
    const res = await client
      .update({
        TableName: process.env.CUSTOM_FILTERS_TABLE,
        Key: { Username: username },
        UpdateExpression: `set #Name = :filtesObj`,
        ExpressionAttributeNames: { '#Name': 'filters' },
        ExpressionAttributeValues: {
          ':filtesObj': filtesObj,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    return res;
  }
  return false;
};
