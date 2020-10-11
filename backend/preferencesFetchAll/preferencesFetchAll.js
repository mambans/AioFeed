'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ username, authkey }) => {
  const res = await client
    .get({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
    })
    .promise();

  if (authkey === res.Item.AuthKey) {
    const columns = { ...res.Item };
    delete columns.Password;
    delete columns.AuthKey;
    delete columns.Username;
    delete columns.Email;
    delete columns.ProfileImg;
    delete columns.YoutubePreferences.Refresh_token;

    return columns;
  }
};
