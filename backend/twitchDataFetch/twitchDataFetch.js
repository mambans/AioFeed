'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const { decrypt } = require('../crypto');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ authkey }) => {
  const username = await validateAuthkey(authkey);
  if (username) {
    const res = await client
      .get({
        TableName: process.env.TWITCH_DATA_TABLE,
        Key: { Username: username },
      })
      .promise();

    return {
      ...res,
      Item: {
        ...res.Item,
        access_token: await decrypt(res.Item.access_token),
        refresh_token: await decrypt(res.Item.refresh_token),
      },
    };
  }
};
