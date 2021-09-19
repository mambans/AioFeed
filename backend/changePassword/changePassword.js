'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const bcrypt = require('bcrypt');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const compare = util.promisify(bcrypt.compare);
const hash = util.promisify(bcrypt.hash);

module.exports = async ({ username, password, new_password, authkey }) => {
  const res = await client
    .get({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
    })
    .promise();

  if (res && authkey === res.Item.AuthKey) {
    const valid = await compare(password, res.Item.Password);

    if (valid) {
      const key = uuidv4();

      const hashedPassword = await hash(new_password, 10);

      const data = await client
        .update({
          TableName: process.env.USERNAME_TABLE,
          Key: { Username: username },
          UpdateExpression: `set #auth_key = :key, #password = :new_password`,
          ExpressionAttributeNames: { '#auth_key': 'AuthKey', '#password': 'Password' },
          ExpressionAttributeValues: {
            ':key': key,
            ':new_password': hashedPassword,
          },
          ReturnValues: 'ALL_NEW',
        })
        .promise();

      return {
        statusCode: 200,
        data: { authkey: data.Attributes.AuthKey, username: data.Attributes.Username },
      };
    } else {
      return {
        statusCode: 401,
        data: { message: 'Invalid Password' },
      };
    }
  } else {
    return {
      statusCode: 401,
      data: { message: 'Invalid Authkey' },
    };
  }
};
