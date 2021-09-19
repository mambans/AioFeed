'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const bcrypt = require('bcrypt');
const util = require('util');
const compare = util.promisify(bcrypt.compare);

module.exports = async ({ username, password, authKey }) => {
  console.log('deleteAccount -> username', username);
  const res = await client
    .get({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
    })
    .promise();

  if (res && res.Item) {
    const validPassword = await compare(password, res.Item.Password);
    const validAuthKey = authKey === res.Item.AuthKey;

    if (!validPassword) {
      return {
        statusCode: 401,
        data: { message: 'Invalid password.' },
      };
    } else if (!validAuthKey) {
      return {
        statusCode: 401,
        data: { message: 'Invalid authKey (relog)' },
      };
    } else {
      const auth_data = await client
        .delete({
          TableName: process.env.USERNAME_TABLE,
          Key: { Username: username },
          ReturnValues: 'ALL_OLD',
        })
        .promise();

      return {
        statusCode: 200,
        data: auth_data,
      };
    }
  } else {
    return {
      statusCode: 401,
      data: { message: 'Invalid Username' },
    };
  }
};
