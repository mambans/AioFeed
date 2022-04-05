'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const bcrypt = require('bcrypt');
const util = require('util');
const compare = util.promisify(bcrypt.compare);
const { encrypt, decrypt } = require('../crypto');
// const { validateAuthkey } = require('../authkey');

const EXPIRE_LENGTH = 180;

module.exports = async ({ username, password }) => {
  const res = await client
    .get({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
    })
    .promise();

  if (res && res.Item) {
    const valid = await compare(password, res.Item.Password);
    if (valid) {
      const date = new Date();
      const expireDate = date.setDate(date.getDate() + EXPIRE_LENGTH);
      const AuthKey = await encrypt([username, expireDate].join('@@'));
      // console.log('decryped aiuthkey:', await validateAuthkey(AuthKey));

      const decryptedData = {
        Attributes: {
          ...res.Item,
          AuthKey,
          TwitchPreferences: res.Item.TwitchPreferences,
          YoutubePreferences: res.Item.YoutubePreferences,
        },
      };

      return {
        statusCode: 200,
        data: decryptedData,
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
      data: { message: 'Invalid Username' },
    };
  }
};
