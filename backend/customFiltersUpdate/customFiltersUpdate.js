'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const validateAuthKey = require('./../validateAuthKey');

module.exports = async ({ username, filtesObj, authkey }) => {
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
  throw new Error('Invalid AuthKey');
};
