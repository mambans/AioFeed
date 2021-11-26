'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ authkey, name }) => {
  const username = await validateAuthkey(authkey);

  const res = await client
    .update({
      TableName: process.env.CUSTOM_FEED_SECTIONS,
      Key: { Username: username },
      UpdateExpression: `REMOVE #feedSection`,
      ExpressionAttributeNames: {
        '#feedSection': name,
      },
    })
    .promise();

  return res;
};
