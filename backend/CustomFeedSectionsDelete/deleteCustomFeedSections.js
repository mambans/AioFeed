'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ username, name }) => {
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

  console.log('res', res);

  return res;
};
