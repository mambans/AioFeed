'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ data, name }) => {
  const username = await validateAuthkey(authkey);

  if (username) {
    const res = await client
      .update({
        TableName: process.env.CUSTOM_FEED_SECTIONS,
        Key: { Username: username },
        UpdateExpression: `set #Name = :data`,
        ExpressionAttributeNames: { '#Name': name },
        ExpressionAttributeValues: {
          ':data': data,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    console.log('res', res);

    return res;
  }
};
