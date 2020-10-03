'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ username }) => {
  const res = await client
    .get({
      TableName: process.env.SAVED_LISTS,
      Key: { Username: username },
    })
    .promise();

  console.log('res', res);

  // if (authkey === res.Attributes.AuthKey) {
  //   return res;
  // }
  return res;
};
