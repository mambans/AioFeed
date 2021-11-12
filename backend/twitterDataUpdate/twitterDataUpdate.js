'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const { encrypt } = require('../crypto');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ data, authkey }) => {
  const username = await validateAuthkey(authkey);

  if (username) {
    const res = await client
      .update({
        TableName: process.env.TWITTER_DATA_TABLE,
        Key: { Username: username },
        UpdateExpression: `set #lists = :lists`,
        ExpressionAttributeNames: { '#lists': 'lists' },
        ExpressionAttributeValues: {
          ':lists': data,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    return res;
  }
};
