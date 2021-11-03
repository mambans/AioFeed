'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const { validateAuthkey } = require('../authkey');
const { encrypt } = require('../crypto');

module.exports = async ({ data, authkey }) => {
  const username = await validateAuthkey(authkey);

  if (username) {
    const res = await client
      .update({
        TableName: process.env.USERNAME_TABLE,
        Key: { Username: username },
        UpdateExpression: `set #ProfileImg = :image`,
        ExpressionAttributeNames: { '#ProfileImg': 'ProfileImg' },
        ExpressionAttributeValues: {
          ':image': data,
        },
      })
      .promise();

    return res;
  }
};
