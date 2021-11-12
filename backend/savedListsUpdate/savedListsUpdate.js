'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ username, videosObj, authkey, listName }) => {
  const username = await validateAuthkey(authkey);
  const res = await client
    .update({
      TableName: process.env.SAVED_LISTS,
      Key: { Username: username },
      UpdateExpression: `set #Name = :videosObj`,
      ExpressionAttributeNames: { '#Name': listName },
      ExpressionAttributeValues: {
        ':videosObj': videosObj,
      },
      ReturnValues: 'ALL_NEW',
    })
    .promise();

  return res;
};
