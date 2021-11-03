'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const { validateAuthkey } = require('../authkey');
const { encrypt } = require('../crypto');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ data, access_token, refresh_token, authkey }) => {
  console.log('refresh_token:', refresh_token);
  console.log('access_token:', access_token);
  console.log('data:', data);
  const username = await validateAuthkey(authkey);

  if (username) {
    const encrypted_AccessToken = await encrypt(access_token);
    const encrypted_RefreshToken = await encrypt(refresh_token);

    const updateExpressions =
      access_token && refresh_token
        ? {
            UpdateExpression: `set #user = :data, #access_token = :access_token, #refresh_token = :refresh_token`,
            ExpressionAttributeNames: {
              '#user': 'user',
              '#access_token': 'access_token',
              '#refresh_token': 'refresh_token',
            },
            ExpressionAttributeValues: {
              ':data': data,
              ':access_token': encrypted_AccessToken,
              ':refresh_token': encrypted_RefreshToken,
            },
          }
        : {
            UpdateExpression: `set #user = :data`,
            ExpressionAttributeNames: { '#user': 'user' },
            ExpressionAttributeValues: {
              ':data': data,
            },
          };

    const res = await client
      .update({
        TableName: process.env.YOUTUBE_DATA_TABLE,
        Key: { Username: username },
        ...updateExpressions,
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    console.log('res:', res);
    return res;
  }
};
